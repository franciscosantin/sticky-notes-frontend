import StickyNoteMapper from "./sticky_note_mapper";

type CreateStickyNote = {
    titulo: string,
    body: string,
    colorDeFondo: string,
    minutosDeValidez: number
};

export type UpdateStickyNote = {
    titulo?: string | null,
    body?: string | null,
    colorDeFondo?: string | null,
    minutosDeValidez?: number | null
};

export default class NotesService {
    static async getNotes(): Promise<StickyNote[]> {
        const data = await fetch(`/api/notas`);
        const stickyNotesRaw = await data.json();
        return StickyNoteMapper.fromJson(stickyNotesRaw);
    }
    static async create(nota: CreateStickyNote): Promise<StickyNote> {
        const data = await fetch(`/api/notas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nota),
        });
        const responseRaw = await data.json();
        return StickyNoteMapper.entityFromJson(responseRaw);
    }
    static async update(id: string, toUpdate: UpdateStickyNote): Promise<StickyNote> {
        const data = await fetch(`/api/notas/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toUpdate),
        });
        const responseRaw = await data.json();
        return StickyNoteMapper.entityFromJson(responseRaw);
    }
    static async delete(id: string) {
        await fetch(`/api/notas/${id}`, {
            method: "DELETE",
        });
    }
}