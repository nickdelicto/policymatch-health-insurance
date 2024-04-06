import React, {useState} from 'react';
import axios from 'axios';

const UserSelectionForm = () => {
    const [formData, setFormData] = useState({
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
    const [errorMessages, setErrorMessages] = useState({});


    // Helper to handle changes in form inputs
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        // Handling checkboxes separately
        if (type === 'checkbox') {
            if (name === 'includeSpouse' || name === 'includeChildren') {
                setFormData({...formData, [name]: checked});
            } else {
                setFormData({
                    ...formData,
                    additionalCovers: {...formData.additionalCovers, [name]:checked},
                });
            }
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



    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.error("Validation failed", errorMessages);
            return; // Stop form submission if validation fails
        }

        // Constructing query parameters
        const params = new URLSearchParams({
            ...formData,
            includeSpouse: undefined, // exclude this as it's not directly used in the query
            includeChildren: undefined, // also exclude for same reason
            // Convert additionalCovers to individual entries
            maternity: formData.additionalCovers.maternity ? 'true' : 'false',
            dental: formData.additionalCovers.dental ? 'true' : 'false',
            optical: formData.additionalCovers.optical ? 'true' : 'false',
            // Handle converting boolean values as needed by your API, for instance:
            // 'true' if included, exclude or 'false' otherwise
        }).toString();


        axios.get(`http://localhost:3001/api/plans?${params}`)
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
                <label>Age of Principal:</label>
                <input
                    type='number'
                    name='age'
                    value={formData.age}
                    onChange={handleChange}
                />
                {errorMessages.age && <div>{errorMessages.age}</div>}
            </div>

            {/* Inpatient Care Limit */}
            <div>
                <label>Inpatient Care Limit:</label>
                <select name='inpatientLimit' value={formData.inpatientLimit} onChange={handleChange}>
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
                        />
                        {errorMessages.numberOfChildren && <div>{errorMessages.numberOfChildren}</div>}
                    </>
                )}
            </div>

            {/* Additional Covers */}
            <div>
                <label>Maternity Cover:</label>
                <input
                    type='checkbox'
                    name='maternity'
                    checked={formData.additionalCovers.maternity}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Dental Cover:</label>
                <input
                    type='checkbox'
                    name='dental'
                    checked={formData.additionalCovers.dental}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Optical Cover:</label>
                <input
                    type='checkbox'
                    name='optical'
                    checked={formData.additionalCovers.optical}
                    onChange={handleChange}
                />
            </div>


            {/* Submit button */}
            <button type='submit'>Submit</button>
        </form>
    )

};

export default UserSelectionForm;