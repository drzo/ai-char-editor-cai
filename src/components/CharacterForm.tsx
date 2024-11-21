import { ChangeEvent } from 'react';
import { Character } from '../types/character';

interface CharacterFormProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function CharacterForm({ character, onChange }: CharacterFormProps) {
  const handleChange = (field: keyof Character) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...character, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={character.name}
          onChange={handleChange('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={character.description}
          onChange={handleChange('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Personality</label>
        <textarea
          value={character.personality}
          onChange={handleChange('personality')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">First Message</label>
        <textarea
          value={character.first_message}
          onChange={handleChange('first_message')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Scenario (Optional)</label>
        <textarea
          value={character.scenario || ''}
          onChange={handleChange('scenario')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {character.avatar && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <img 
            src={character.avatar} 
            alt={character.name} 
            className="mt-1 h-32 w-32 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}