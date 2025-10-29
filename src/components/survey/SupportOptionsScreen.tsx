'use client';
import { useState } from 'react';
import type { SupportRequestData } from './SupportPath';

interface SupportOptionsScreenProps {
  onComplete: (data: SupportRequestData) => void;
  onCancel: () => void;
}

export function SupportOptionsScreen({ onComplete, onCancel }: SupportOptionsScreenProps) {
  const [contacts, setContacts] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<string>('work_email');
  const [contactValue, setContactValue] = useState('');
  const [timeframe, setTimeframe] = useState('this_week');
  const [otherDetails, setOtherDetails] = useState('');

  const availableContacts = [
    'HR Team',
    'WHS Leader',
    'My Direct Manager',
    'Senior Leadership',
    'EAP (Employee Assistance Program)',
    'Union Representative',
    'Other'
  ];

  const toggleContact = (contact: string) => {
    setContacts(prev => 
      prev.includes(contact) 
        ? prev.filter(c => c !== contact)
        : [...prev, contact]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contacts.length === 0) {
      alert('Please select at least one contact person.');
      return;
    }

    onComplete({
      requested: true,
      contacts,
      contactMethod,
      contactValue,
      timeframe,
      otherDetails
    });
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-8">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">
        Who would you like to connect with?
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        Select all that apply (configured per your organisation):
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Selection */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-3">
            Available Contacts:
          </label>
          <div className="space-y-2">
            {availableContacts.map(contact => (
              <label key={contact} className="flex items-center">
                <input
                  type="checkbox"
                  checked={contacts.includes(contact)}
                  onChange={() => toggleContact(contact)}
                  className="mr-3 h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-blue-800">{contact}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Details */}
        {contacts.includes('Other') && (
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Please specify:
            </label>
            <input
              type="text"
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              placeholder="Who would you like to contact?"
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required={contacts.includes('Other')}
            />
          </div>
        )}

        {/* Contact Method */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            How should they contact you?
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="work_email"
                checked={contactMethod === 'work_email'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-blue-800">My work email (pre-filled)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="personal_email"
                checked={contactMethod === 'personal_email'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-blue-800">Different email:</span>
              {contactMethod === 'personal_email' && (
                <input
                  type="email"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="your.email@example.com"
                  className="ml-2 flex-1 p-2 border border-blue-300 rounded"
                  required
                />
              )}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={contactMethod === 'phone'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-blue-800">Phone:</span>
              {contactMethod === 'phone' && (
                <input
                  type="tel"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                  className="ml-2 flex-1 p-2 border border-blue-300 rounded"
                  required
                />
              )}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="anonymous"
                checked={contactMethod === 'anonymous'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-blue-800">Request anonymous meeting (HR will arrange)</span>
            </label>
          </div>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Preferred timeframe:
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Within 24 hours</option>
            <option value="this_week">Within this week</option>
            <option value="flexible">When convenient</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-white text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}


