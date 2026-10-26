"use client";

import React from 'react';
import { useState } from "react";
import NotesService, { UpdateStickyNote } from './notes_service';

const StickyNoteComp = ({ id, title, body, bgColor, validUntil, onDelete, onEditedFields }: {
  id: string;
  title: string;
  body: string;
  bgColor: string;
  validUntil: string;
  onEditedFields: (title: string, body: string, bgColor: string, validUntil: string) => void;
  onDelete: () => void
}) => {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');
  const [editEnabled, setEditEnabled] = useState(false);
  const [edTitle, setTitle] = useState(title);
  const [edBody, setEdBody] = useState(body);
  const [edBgColor, setEdBgColor] = useState(bgColor);
  const [edValidUntil, setEdValidUntil] = useState(validUntil);
  const deleteNote = async (id: string) => {
    try {
      setError('');
      setLoading(true);
      await NotesService.delete(id);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      setError(e.toString());
    }
  };
  const updateNote = async (id: string, toUpdate: UpdateStickyNote): Promise<StickyNote | null> => {
    try {
      setError('');
      setLoading(true);
      const result = await NotesService.update(id, toUpdate);
      setLoading(false);
      return result;
    } catch (e: any) {
      setLoading(false);
      setError(e.toString());
      return null;
    }
  }
  const cardStyle = `bg-${bgColor} flex flex-col items-center gap-6 p-7 rounded-2xl shadow-xl rounded-md border border-white w-md m-auto mb-5`;
  const titleStyle = "text-xl font-bold";
  const btnStyle = "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50";
  const inputStyle = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100";
  const labelStyle = "mb-1.5 block text-sm font-semibold leading-5 text-gray-100";
  if (editEnabled) {
    return (
      <>
        <div className={cardStyle}>
          <label className={labelStyle}>
            Titulo: <input className={inputStyle} value={edTitle} onChange={(v) => setTitle(v.target.value)} />
          </label>
          <label className={labelStyle}>
            Body: <input className={inputStyle} value={edBody} onChange={(v) => setEdBody(v.target.value)} />
          </label>
          <label className={labelStyle}>
            BgColor: <input className={inputStyle} value={edBgColor} onChange={(v) => setEdBgColor(v.target.value)} />
          </label>
          <label className={labelStyle}>
            Minutos de validez: <input className={inputStyle} value={edValidUntil} onChange={(v) => setEdValidUntil(v.target.value)} />
          </label>
          <button className={btnStyle} onClick={() => setEditEnabled(false)}>Cancelar</button>
          <button className={btnStyle} onClick={async () => {
            const result = await updateNote(id, {
              titulo: edTitle.length > 0 ? edTitle : null,
              body: edBody.length > 0 ? edBody : null,
              colorDeFondo: edBgColor.length > 0 ? edBgColor : null,
              minutosDeValidez: edValidUntil.length > 0 ? Number(edValidUntil) : null,
            }
            );
            if (result) onEditedFields(result.title, result.body, result.bgColor, result.validUntil);
            setEditEnabled(false);
          }}>Guardar</button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={cardStyle}>
        <h1 className={titleStyle}>{title}</h1>
        <p>{body}</p>
        <span>{`Valido hasta: ${validUntil}`}</span>
        <br/>
        <button className={btnStyle} onClick={async () => {
          await deleteNote(id);
          onDelete();
        }}>Eliminar</button>
        <button className={btnStyle} onClick={() => setEditEnabled(true)}>Editar</button>
      </div>
    </>
  );
};

export default StickyNoteComp;
