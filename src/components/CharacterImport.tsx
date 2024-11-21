import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Character } from '../types/character';
import { fetchCharacterAIProfile } from '../utils/characterAI';

interface CharacterImportProps {
  onImport: (character: Character) => void;
}

export function CharacterImport({ onImport }: CharacterImportProps) {
  const [characterUrl, setCharacterUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!characterUrl.trim()) {
      toast.error('Please enter a Character.AI URL or ID');
      return;
    }

    setIsLoading(true);
    try {
      const character = await fetchCharacterAIProfile(characterUrl);
      onImport(character);
      setCharacterUrl('');
      toast.success('Character imported successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import character';
      console.error('Import error:', { message, error });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={characterUrl}
            onChange={(e) => setCharacterUrl(e.target.value)}
            placeholder="Enter Character.AI URL or ID"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a character URL (e.g., https://beta.character.ai/chat?char=...) or character ID
          </p>
        </div>
        <button
          onClick={handleImport}
          disabled={isLoading || !characterUrl.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Importing...
            </>
          ) : (
            'Import Character'
          )}
        </button>
      </div>
    </div>
  );
}