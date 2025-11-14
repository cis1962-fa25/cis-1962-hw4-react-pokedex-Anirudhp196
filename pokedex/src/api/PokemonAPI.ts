import type { Pokemon, BoxEntry, InsertBoxEntry, UpdateBoxEntry } from '../types/types';

const BASE_URL = 'https://hw4.cis1962.esinx.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiYW5pcDA2IiwiaWF0IjoxNzU5MDk4MjE4LCJpc3MiOiJlZHU6dXBlbm46c2VhczpjaXMxOTYyIiwiYXVkIjoiZWR1OnVwZW5uOnNlYXM6Y2lzMTk2MiIsImV4cCI6MTc2NDI4MjIxOH0.RzQA2mNAyY8a6JotbKcNkNyJazVuBP8ZNg8LZESQf2A';

export default class PokemonAPI {
    private baseUrl: string;
    private jwtToken: string;


    constructor(baseUrl = BASE_URL, jwtToken = JWT_TOKEN) {
        this.baseUrl = baseUrl;
        this.jwtToken = jwtToken;
    }

    // Pokemon Endpoints

    async getPokemonList(limit: number, offset: number): Promise<Pokemon[]> {
        const response = await fetch(`${this.baseUrl}/pokemon/?limit=${limit}&offset=${offset}`);
        if(!response.ok) {
            throw new Error(`Error fetching pokemon list: ${response.statusText}`);
        }
        return response.json();
    }

    async getPokemonByName(name: string): Promise<Pokemon> {
        const response = await fetch(`${this.baseUrl}/pokemon/${name}`);
        if(!response.ok) {
            throw new Error(`Failed to fetch Pokemon: ${name}`);
        }
        return response.json();
    }

    // Box Entry Endpoints

    async getBoxEntries() : Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/box/`, {
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
            },
        });
        if(!response.ok) {
            throw new Error(`Error fetching box entries: ${response.statusText}`);
        }
        return response.json();
    }

    async createBoxEntry(entry: InsertBoxEntry): Promise<BoxEntry> {
        const response = await fetch(`${this.baseUrl}/box/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.jwtToken}`,
            },
            body: JSON.stringify(entry),
        });
        if(!response.ok) {
            throw new Error(`Error creating box entry: ${response.statusText}`);
        }
        return response.json();
    }

    async getBoxEntryById(id: string): Promise<BoxEntry> {
        const response = await fetch(`${this.baseUrl}/box/${id}`, {
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
            },
        });
        if(!response.ok) {
            throw new Error(`Error fetching box entry: ${response.statusText}`);
        }
        return response.json();
    }

    async updateBoxEntry(id: string, update: UpdateBoxEntry): Promise<BoxEntry> {
        const response = await fetch(`${this.baseUrl}/box/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.jwtToken}`,
            },
            body: JSON.stringify(update),
        });
        if(!response.ok) {
            throw new Error(`Error updating box entry: ${response.statusText}`);
        }
        return response.json();
    }

    async deleteBoxEntry(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/box/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
            },
        });
        if(!response.ok) {
            throw new Error(`Error deleting box entry: ${response.statusText}`);
        }
    }

    async clearAllBoxEntries(): Promise<void> {
        const response = await fetch(`${this.baseUrl}/box/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.jwtToken}`,
            },
        });
        if(!response.ok) {
            throw new Error(`Error clearing all box entries: ${response.statusText}`);
        }
    }
}