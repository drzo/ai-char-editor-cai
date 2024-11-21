export interface Character {
  name: string;
  description: string;
  personality: string;
  first_message: string;
  avatar?: string;
  scenario?: string;
  example_conversations?: string[];
  system_prompt?: string;
}

export interface CharacterFile {
  format: string;
  version: string;
  character: Character;
  metadata?: Record<string, unknown>;
}