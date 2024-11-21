import { Character, CharacterFile } from '../types/character';

export function formatCharacterAI(character: Character): any {
  return {
    name: character.name,
    description: character.description,
    personality: character.personality,
    first_message: character.first_message,
    avatar_url: character.avatar,
    greeting: character.first_message,
    example_conversations: character.example_conversations || []
  };
}

export function formatPygmalion(character: Character): any {
  return {
    name: character.name,
    description: character.description,
    personality: character.personality,
    first_message: character.first_message,
    scenario: character.scenario,
    example_dialogue: character.example_conversations
  };
}

export function formatTextGeneration(character: Character): any {
  return {
    char_name: character.name,
    char_persona: character.personality,
    char_greeting: character.first_message,
    world_scenario: character.scenario,
    example_dialogue: character.example_conversations,
    system_prompt: character.system_prompt
  };
}

export function formatTavernAI(character: Character): any {
  return {
    name: character.name,
    description: character.description,
    personality: character.personality,
    first_mes: character.first_message,
    scenario: character.scenario,
    mes_example: character.example_conversations
  };
}

export function formatKoboldAI(character: Character): any {
  return {
    name: character.name,
    description: character.description,
    personality: character.personality,
    greeting: character.first_message,
    scenario: character.scenario,
    examples: character.example_conversations
  };
}