import { useState } from 'react';
import './FishForm.css'


type FishFormProps = {
    API_URL: string;
    setError: (error: string | null) => void;
}

function FishForm({ API_URL, setError }: FishFormProps) {
    // state for new fish form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newFishSpecies, setNewFishSpecies] = useState('');
    const [newFishTrackingInfo, setNewFishTrackingInfo] = useState('');

    const handleAddFish = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    species: newFishSpecies,
                    trackingInfo: newFishTrackingInfo,
                    weightKG: 0.1,
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error(`Failed to add new fish: ${err}`);
            setError('Failed to add new fish. Please try again.');
        }
    }

    return ( 
        <>
            <div className='controls'>
                <button onClick={() => setIsFormVisible(!isFormVisible)}
                    className='add-fish-button'
                    >
                    {isFormVisible ? 'Cancel' : 'Add New Fish'}
                </button>
            </div>

            {isFormVisible && (
                <div className='add-fish-form-container'>
                    <h2 className='form-title'>Add New Fish</h2>
                    <form onSubmit={handleAddFish} className='add-fish-form'>
                        <div>
                            <label className='form-label'>Species</label>
                            <input 
                                type='text'
                                value={newFishSpecies}
                                onChange={e => setNewFishSpecies(e.target.value)}
                                className='form-input'
                                required
                            />
                        </div>
                        <div>
                            <label className='form-label'>Tracking Info</label>
                            <input 
                                type='text'
                                value={newFishTrackingInfo}
                                onChange={e => setNewFishTrackingInfo(e.target.value)}
                                className='form-input'
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type='submit' className='submit-button'>Create Fish</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )

}

export default FishForm;