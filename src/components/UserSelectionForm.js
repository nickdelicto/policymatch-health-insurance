import React, {useState} from 'react';

const UserSelectionForm = () => {
    const [age, setAge] = useState('');
    const [inpatientLimit, setInpatientLimit] = useState('');
    const [includeSpouse, setIncludeSpouse] = useState(false);
    const [spouseAge, setSpouseAge] = useState('');
    const [includeChildren, setIncludeChildren] = useState(false);
    const [numberOfChildren, setNumberOfChildren] = useState('');
    const [additionalCovers, setAdditionalCovers] = useState({
        maternity: false,
        dental: false,
        optical: false,
    });

    // New state variables for validation messages
    const [ageValidationMessage, setAgeValidationMessage] = useState('');
    const[spouseAgeValidationMessage, setSpouseAgeValidationMessage] = useState('');
    const[childrenValidationMessage, setChildrenValidationMessage] = useState('');

    const validateAge = (age) => age >= 18 && age <= 79;


    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset validation messages
        setAgeValidationMessage('');
        setSpouseAgeValidationMessage('');
        setChildrenValidationMessage('');

        // Validate principal's age
        if (!validateAge(Number(age))) {
            setAgeValidationMessage('Age must be between 18 and 79.');
            return; // Prevent form submission
        }

        // Validate spouse's age if spouse is included
        if (includeSpouse && !validateAge(Number(spouseAge))) {
            setSpouseAgeValidationMessage('Spouse age must be between 18 and 79.');
            return; // Prevent form submission
        }

        // Additional validation for principals 65 or order with a spouse under 65
        if (includeSpouse && Number(age) >= 65 && Number(spouseAge) < 65) {
            setSpouseAgeValidationMessage('Since your partner is over 65 and you are under 65, you must get a separate cover.');
            return; // Prevent form submission
        }

        // Validate number of children
        if (includeChildren && (Number(numberOfChildren) < 1 || Number(numberOfChildren) > 5)) {
            setChildrenValidationMessage('Number of children must be between 1 and 5.');
            return; // Prevent form submission
        }

        // Log the form data for debugging purposes
        console.log({
            age,
            inpatientLimit,
            includeSpouse,
            spouseAge: includeSpouse ? spouseAge : undefined,
            includeChildren,
            numberOfChildren: includeChildren ? numberOfChildren : undefined,
            additionalCovers,
        });
        // TODO: Proceed with API call or further processing after validation passes
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Principal's age input and validation message */}
            <div>
                <label>Age of Principal:</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} />
                {ageValidationMessage && <div>{ageValidationMessage}</div>}
            </div>
            {/* Inpatient care limit dropdown */}
            <div>
                <label>Inpatient Care Limit:</label>
                <select value={inpatientLimit} onChange={e => setInpatientLimit(e.target.value)}>
                    <option value="">Select Inpatient Care Limit</option>
                    <option value="100000">Kshs 100,000</option>
                    <option value="250000">Kshs 250,000</option>
                    <option value="500000">Kshs 500,000</option>
                    <option value="1000000">Kshs 1,000,000</option>
                    <option value="2000000">Kshs 2,000,000</option>
                    <option value="3000000">Kshs 3,000,0000</option>
                    <option value="5000000">Kshs 5,000,000</option>
                    <option value="10000000">Kshs 10,000,000</option>
                </select>
            </div>
            <div>
                <label>Include Spouse:</label>
                <input type="checkbox" checked={includeSpouse} onChange={() => setIncludeSpouse(!includeSpouse)} />
                {/* Spouse's age input and validation message */}
                {includeSpouse && (
                    <div>
                        <label>Spouse Age:</label>
                        <input type="number" value={spouseAge} onChange={e => setSpouseAge(e.target.value)} />
                        {spouseAgeValidationMessage && <div>{spouseAgeValidationMessage}</div>}
                    </div>
                )}
            </div>
            <div>
                <label>Include Under-18 Children:</label>
                <input type="checkbox" checked={includeChildren} onChange={() => setIncludeChildren(!includeChildren)} />
                {/* Number of children input and validation message */}
                {includeChildren && (
                    <div>
                        <label>Number of Children:</label>
                        <input type="number" value={numberOfChildren} onChange={e => setNumberOfChildren(e.target.value)} />
                        {childrenValidationMessage && <div>{childrenValidationMessage}</div>}
                    </div>
                )}
            </div>
            <div>
                <label>Maternity Cover:</label>
                <input type="checkbox" checked={additionalCovers.maternity} onChange={() => setAdditionalCovers({...additionalCovers, maternity: !additionalCovers.maternity})} />
            </div>
            <div>
                <label>Dental Cover:</label>
                <input type="checkbox" checked={additionalCovers.dental} onChange={() => setAdditionalCovers({...additionalCovers, dental: !additionalCovers.dental})} />
            </div>
            <div>
                <label>Optical Cover:</label>
                <input type="checkbox" checked={additionalCovers.optical} onChange={() => setAdditionalCovers({...additionalCovers, optical: !additionalCovers.optical})} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserSelectionForm;