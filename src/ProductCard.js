import React, {useState} from 'react';

const ProductCard = ({product}) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white my-4">
            <div className="p-4 flex flex-col justify-between leading-normal">
                <h3 className="text-xl font-bold mb-2">{product.companyName} - {product.planName}</h3>
                <p className="text-gray-700 text-base">Inpatient Cover: Kshs {product.inpatientCover}</p>
                {/* Display Outpatient Cover if applicable */}
                {product.outpatientCover && (
                    <p className="text-gray-700 text-base">Outpatient Cover: Kshs {product.outpatientCover}</p>
                )}
                <p className="text-gray-900 text-base">Annual Premium: Kshs {product.annualPremium} </p>
                <div>
                    <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={toggleDetails}>
                        See More
                    </button>
                    {isDetailsVisible && (
                        <div className="text-gray-700 text-base mt-4">
                            {product.includeMaternity && <p>Maternity Cover: Kshs {product.maternityCover}</p>}
                            {product.includeDental && <p>Dental Cover: Kshs {product.dentalCover}</p>}
                            {product.includeOptical && <p>Optical Cover: Kshs {product.opticalCover}</p>}
                            {/* Include additional dynamic fields based on product attributes that you want to show here */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProductCard;