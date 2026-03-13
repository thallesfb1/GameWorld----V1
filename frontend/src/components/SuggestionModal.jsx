import { useState } from 'react';
import { submitSuggestion } from '../services/api';

export default function SuggestionModal({ onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        era_or_year: '',
        reference_link: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await submitSuggestion(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2500); // Close after showing success message briefly
        } catch (err) {
            setError('Failed to submit suggestion. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card suggestion-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close suggestion modal">✕</button>
                
                <h2 className="modal-title">Suggest a Game</h2>
                <p className="suggestion-subtitle">Notice a game missing from the map? Let us know!</p>
                
                {success ? (
                    <div className="suggestion-success">
                        <span className="success-icon">✅</span>
                        <h3>Thank you!</h3>
                        <p>Your suggestion has been securely sent to the repository.</p>
                    </div>
                ) : (
                    <form className="suggestion-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Game Title*</label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                required 
                                value={formData.title} 
                                onChange={handleChange}
                                placeholder="e.g., The Witcher 3"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="location">Geographic Location*</label>
                            <input 
                                type="text" 
                                id="location" 
                                name="location" 
                                required 
                                value={formData.location} 
                                onChange={handleChange}
                                placeholder="e.g., Poland / Northern Kingdoms"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="era_or_year">Era or Release Year*</label>
                            <input 
                                type="text" 
                                id="era_or_year" 
                                name="era_or_year" 
                                required 
                                value={formData.era_or_year} 
                                onChange={handleChange}
                                placeholder="e.g., 2015 / Medieval Fantasy"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reference_link">Reference Link (Optional)</label>
                            <input 
                                type="url" 
                                id="reference_link" 
                                name="reference_link" 
                                value={formData.reference_link} 
                                onChange={handleChange}
                                placeholder="Steam or Wikipedia URL"
                            />
                        </div>

                        {error && <p className="suggestion-error">{error}</p>}

                        <button type="submit" className="btn-submit-suggestion" disabled={submitting}>
                            {submitting ? 'Sending...' : 'Send Suggestion'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
