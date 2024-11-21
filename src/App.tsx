import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FileUpload } from './components/FileUpload';
import { CharacterForm } from './components/CharacterForm';
import { CharacterImport } from './components/CharacterImport';
import { Character, CharacterFile } from './types/character';
import * as formatters from './utils/formatters';

const SUPPORTED_FORMATS = ['CharacterAI', 'Pygmalion', 'TextGeneration', 'TavernAI', 'KoboldAI'] as const;
type FormatType = typeof SUPPORTED_FORMATS[number];

const EMPTY_CHARACTER: Character = {
  name: '',
  description: '',
  personality: '',
  first_message: '',
};

function App() {
  const [character, setCharacter] = useState<Character>(EMPTY_CHARACTER);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('CharacterAI');

  const handleFileLoad = (data: CharacterFile) => {
    setCharacter(data.character);
  };

  const handleExport = () => {
    const formatKey = `format${selectedFormat}` as keyof typeof formatters;
    const formatFn = formatters[formatKey];
    if (!formatFn) return;

    const formatted = formatFn(character);
    const blob = new Blob([JSON.stringify(formatted, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name || 'character'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Character Editor</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-8">
            <FileUpload onFileLoad={handleFileLoad} />
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Import from Character.AI</h2>
              <CharacterImport onImport={setCharacter} />
            </div>

            {character && (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Character</h2>
                  <CharacterForm 
                    character={character}
                    onChange={setCharacter}
                  />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Export Character</h2>
                  <div className="flex items-center gap-4">
                    <select
                      className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as FormatType)}
                    >
                      {SUPPORTED_FORMATS.map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleExport}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Export Character
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;