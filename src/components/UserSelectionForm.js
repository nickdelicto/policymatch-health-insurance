import React, {useState} from 'react';
import axios from 'axios';

const UserSelectionForm = () => {
    const [formData, setFormData] = useState({
        age: '',
        inpatientLimit: '',
        outpatientLimit: '',
        includeSpouse: false,
        spouseAge: '',
        includeChildren: false,
        numberOfChildren: '',
        additionalCovers: {
            maternity: 'No',
            dental: 'No',
            optical: 'No', // Changes based on dental
        },
    });
    const [outpatientLimits, setOutpatientLimits] = useState([]); // Store outpatient limits
    const [loadingOutpatientLimits, setLoadingOutpatientLimits] = useState(false); // Loading state
    const [errorMessages, setErrorMessages] = useState({});


    // Helper to handle changes in form inputs
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        if (type === 'checkbox' && (name === 'includeSpouse' || name === 'includeChildren')) {
            setFormData({...formData, [name]: checked});
        } else if (name in formData.additionalCovers) {
            const updatedCovers = {...formData.additionalCovers, [name]: value};
            if (name === 'dental' && value === 'Yes') {
                updatedCovers.optical = 'Yes'; // Optical is linked with Dental
            } else if (name === 'dental' && value === 'No') {
                updatedCovers.optical = 'No'; // Reset Optical is Dental is 'No'
            }
            setFormData({...formData, additionalCovers: updatedCovers});
        } else {
            setFormData({...formData, [name]: value});
        }
    };


    // Helper for validating the form data
    const validateForm = () => {
        let isValid = true;
        let errors = {};

        // Validate principal's age
        if (!formData.age || formData.age < 18 || formData.age > 79) {
            errors.age = 'Age must be between 18 and 79.';
            isValid = false;
        }

        // Validate inpatient limit is selected
        if (!formData.inpatientLimit) {
            errors.inpatientLimit = 'Selecting an inpatient care limit is required.';
            isValid = false;
        }

        // Conditional validations
        if (formData.includeSpouse) {
            // Validate spouse's age if spouse is included
            if (!formData.spouseAge || formData.spouseAge < 18 || formData.spouseAge > 79) {
                errors.spouseAge = 'Spouse age must be between 18 and 79.'
                isValid = false;
            }

            // Additional validation for age compatibility between principal and spouse
            if (formData.age > 65 && formData.spouseAge <= 65) {
                errors.spouseAge = 'Because principal is above 65, spouse must also be above 65. Otherwise buy separate plans.'
                isValid = false;
            } else if (formData.age <= 65 && formData.spouseAge > 65) {
                errors.spouseAge = 'Because principal is 65 or below, spouse must be 65 or below. Otherwise buy separate plans.'
                isValid = false;
            }
        }


        if (formData.numberOfChildren) {
            // Validate number of children
            if (!formData.numberOfChildren || formData.numberOfChildren < 1 || formData.numberOfChildren > 5) {
                errors.numberOfChildren = 'Number of children must be between 1 and 5.';
                isValid = false;
            }

            // Ensure principal age and inpatient limit are provided for dependent fields
            if (formData.numberOfChildren && (!formData.age || !formData.inpatientLimit)) {
                errors.numberOfChildren = 'Including children requires both principal age and inpatient limit to be specified.'
                isValid = false;
            }
        }

        // Validate maternity cover dependencies
        if (formData.additionalCovers.maternity && (!formData.age || !formData.inpatientLimit)) {
            errors.maternity = 'Maternity cover requires both principal age and inpatient limit to be specified.'
            isValid = false;
        }

        // Validate dental cover dependencies
        if (formData.additionalCovers.dental && (!formData.age || !formData.inpatientLimit || !formData.outpatientLimit)) {
            errors.dental = 'Dental cover requires inpatient limit, principal age, and outpatient limit to be specified.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    };



    // Defining a reset function when form submitted successfully
    const resetForm = () => {
        setFormData({
            age: '',
            inpatientLimit: '',
            includeSpouse: false,
            spouseAge: '',
            includeChildren: false,
            numberOfChildren: '',
            additionalCovers: {
                maternity: false,
                dental: false,
                optical: false,
            },
        });
        setErrorMessages({});
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.error("Validation failed", errorMessages);
            return; // Stop form submission if validation fails
        }

        // Constructing query parameters
        let queryParams = new URLSearchParams({
            principalAge: formData.age,
            inpatientLimit: formData.inpatientLimit,
            ...(formData.includeSpouse && {spouseAge: formData.spouseAge}),
            ...(formData.includeChildren && {numberOfKids: formData.numberOfChildren }),
            ...(formData.additionalCovers.maternity === 'Yes' && {maternity: 'true'}),
            ...(formData.additionalCovers.dental === 'Yes' && {dental: 'true', optical: 'true'}), // Include optical with dental
            
        });


        axios.get(`http://localhost:3001/api/plans?${queryParams}`)
            .then(response => {
                console.log("Filtered plans:", response.data);
                // Handle displaying the filtered plans here
                resetForm(); // Reset form only after successful submission
            }).catch(error => {
                console.log("Error fetching filtered plans:", error.response?.data || error.message);
                // Handle displaying an error message here
            });
    };

    
    // Render function for form

    return (
        <form onSubmit={handleSubmit}>
            {/* Dynamically generate form fields based on state */}
            {/* Principal's Age */}
            <div>
                <label>Principal Age:</label>
                <input
                    type='number'
                    name='age'
                    value={formData.age}
                    onChange={handleChange}
                    required // Ensures field must be filled out
                    min='18' // Ensures age cannot be below 18
                    max='79' // Ensures age cannot be above 79
                />
                {errorMessages.age && <div>{errorMessages.age}</div>}
            </div>

            {/* Inpatient Care Limit */}
            <div>
                <label>Inpatient Care Limit:</label>
                <select name='inpatientLimit' value={formData.inpatientLimit} onChange={handleChange} required>
                    <option value="">Select Inpatient Care Limit</option>
                    <option value="100000">Kshs 100,000</option>
                    <option value="250000">Kshs 250,000</option>
                    <option value="500000">Kshs 500,000</option>
                    <option value="750000">Kshs 750,000</option>
                    <option value="1000000">Kshs 1,000,000</option>
                    <option value="1500000">Kshs 1,500,000</option>
                    <option value="2000000">Kshs 2,000,000</option>
                    <option value="3000000">Kshs 3,000,000</option>
                    <option value="5000000">Kshs 5,000,000</option>
                    <option value="10000000">Kshs 10,000,000</option>
                </select>
                {errorMessages.inpatientLimit && <div>{errorMessages.inpatientLimit}</div>}
            </div>

            {/* Include Spouse */}
            <div>
                <label>Include Spouse:</label>
                <input
                    type='checkbox'
                    name='includeSpouse'
                    checked={formData.includeSpouse}
                    onChange={handleChange}
                />
                {formData.includeSpouse && (
                    <>
                        <label>Spouse Age:</label>
                        <input
                            type='number'
                            name='spouseAge'
                            value={formData.spouseAge}
                            onChange={handleChange}
                            required // Ensures field must be filled out
                            min='18' // Ensures age cannot be below 18
                            max='79' // Ensures age cannot be above 79
                        />
                        {errorMessages.spouseAge && <div>{errorMessages.spouseAge}</div>}
                    </>
                )}
            </div>

            {/* Include Children */}
            <div>
                <label>Include Under-18 Children:</label>
                <input
                    type='checkbox'
                    name='includeChildren'
                    checked={formData.includeChildren}
                    onChange={handleChange}
                />
                {formData.includeChildren && (
                    <>
                        <label>Number of Children: </label>
                        <input
                            type='number'
                            name='numberOfChildren'
                            value={formData.numberOfChildren}
                            onChange={handleChange}
                            required // Ensures field must be filled out
                            min='1' // Ensures no.of kids cannot be below 1
                            max='5' // Ensures no. of kids cannot be above 5
                        />
                        {errorMessages.numberOfChildren && <div>{errorMessages.numberOfChildren}</div>}
                    </>
                )}
            </div>

            {/* Additional Covers */}
            <div>
                <label>Maternity Cover:</label>
                <select name='maternity' value={formData.additionalCovers.maternity} onChange={handleChange} required>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div>
                <label>Dental Cover:</label>
                <select name='dental' value={formData.additionalCovers.dental} onChange={handleChange} required>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option> 
                </select>
            </div>

            {/* Optical Cover (linked to Dental & NOT editable) */}
            <div>
                <label>Optical Cover:</label>
                <select name='optical' value={formData.additionalCovers.optical} onChange={handleChange} disabled>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option> 
                </select>
            </div>

                        {/* Include dynamic select for outpatient limits if dental is 'Yes'*/}
                        {formData.additionalCovers.dental === 'Yes' && (
                <div>
                    <label>Outpatient Limit:</label>
                    <select name='outpatientLimit' value={formData.outpatientLimit} onChange={handleChange} disabled={loadingOutpatientLimits} required>
                        <option value="">Select Outpatient Limit</option>
                        {outpatientLimits.map((limit) => (
                            <option key={limit} value={limit}>{`Kshs ${limit}`}</option>
                        ))}
                    </select>
                </div>
            )}


            {/* Submit button */}
            <button type='submit'>Submit Details</button>
        </form>
    )

};

export default UserSelectionForm;