'use client';
import { useState } from 'react';

interface SupportRequestProps {
  onRequestSupport: (data: {
    preferredContact: string;
    contactMethod: 'phone' | 'email';
    contactDetails?: string;
    timeframe: string;
    concernArea?: string;
  }) => void;
}

export function SupportRequest({ onRequestSupport }: SupportRequestProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    preferredContact: '',
    contactMethod: 'phone' as 'phone' | 'email',
    contactDetails: '',
    timeframe: 'this_week',
    concernArea: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSupport(formData);
    setShowForm(false);
    setFormData({
      preferredContact: '',
      contactMethod: 'phone',
      contactDetails: '',
      timeframe: 'this_week',
      concernArea: ''
    });
  };

  if (!showForm) {
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need Support?
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            If you're struggling with any of these areas, we can connect you with someone who can help.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        Request Support
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Who would you prefer to contact you?
          </label>
          <select
            value={formData.preferredContact}
            onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
            className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a contact person</option>
            <option value="manager">My Manager</option>
            <option value="hr">HR Team</option>
            <option value="wellbeing">Wellbeing Coordinator</option>
            <option value="eap">Employee Assistance Program</option>
            <option value="other">Other (specify in notes)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Preferred contact method:
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as 'phone', contactDetails: '' })}
                className="mr-2"
              />
              Phone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={formData.contactMethod === 'email'}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as 'email', contactDetails: '' })}
                className="mr-2"
              />
              Email
            </label>
          </div>
          
          {/* Contact Details Input */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              {formData.contactMethod === 'phone' ? 'Phone Number' : 'Email Address'} (optional):
            </label>
            <input
              type={formData.contactMethod === 'phone' ? 'tel' : 'email'}
              value={formData.contactDetails}
              onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
              placeholder={formData.contactMethod === 'phone' ? '+61 4XX XXX XXX' : 'your.email@example.com'}
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-blue-600 mt-1">
              {formData.contactMethod === 'phone' 
                ? 'Leave blank to use your registered phone number' 
                : 'Leave blank to use your registered email address'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            When would you like to be contacted?
          </label>
          <select
            value={formData.timeframe}
            onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
            className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="urgent">Within 24 hours (urgent)</option>
            <option value="this_week">This week</option>
            <option value="next_week">Next week</option>
            <option value="flexible">I'm flexible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            General area of concern (optional):
          </label>
          <textarea
            value={formData.concernArea}
            onChange={(e) => setFormData({ ...formData, concernArea: e.target.value })}
            placeholder="Briefly describe what you'd like support with..."
            className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
