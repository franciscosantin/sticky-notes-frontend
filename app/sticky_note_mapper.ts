export default class StickyNoteMapper {
    static fromJson(snRaw: any): StickyNote[] {
        return snRaw.map(
            (e: any) => <StickyNote>{
                id: e.id,
                title: e.titulo,
                body: e.body,
                bgColor: e.colorDeFondo,
                validUntil: e.validoHasta,
            }
        );
    } 
    static entityFromJson(snRaw: any): StickyNote {
        return <StickyNote>{
                id: snRaw.id,
                title: snRaw.titulo,
                body: snRaw.body,
                bgColor: snRaw.colorDeFondo,
                validUntil: snRaw.validoHasta,
        };
    } 
}