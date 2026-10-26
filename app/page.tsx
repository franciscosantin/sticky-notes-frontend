"use client";

import Image from "next/image";
import StickyNoteComp from "./sticky_note";
import { useState, useEffect } from "react";
import NotesService from "./notes_service";

export default function NotasAdhesivasPage() {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')
  const [ loaded, setLoaded ] = useState(false);
  const [ stickyNotes, setStickyNotes ] = useState<StickyNote[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [bgColorInput, setBgColorInput] = useState("");
  const [minutesInput, setMinutesInput] = useState("");
  const btnStyle = "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50";
  const hdrStyle = "flex flex-col items-center gap-6 p-7 rounded-2xl shadow-xl rounded-md w-md m-auto mt-6 mb-5 w-xl";
  const titleStyle = "text-xl font-bold";
  const inputStyle = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100";
  const labelStyle = "mb-1.5 block text-sm font-semibold leading-5 text-gray-100";
  const onAddStickyNote = async () => {
    if (titleInput == "") {
      return;
    }

    // Se usa el servicio en vez de crear la nota localmente
    const newSN = await NotesService.create({ titulo: titleInput, body: bodyInput, colorDeFondo: bgColorInput, minutosDeValidez: Number(minutesInput) });

    setTimeout(() => {
      new Notification(`La nota ${titleInput} cumplió su validez`);
    }, Number(minutesInput) * 60 * 1000);
    setStickyNotes([newSN, ...stickyNotes]);
  };
  const initialLoad = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Obteniendo notas adhesivas.....');
      const initialNotes = await NotesService.getNotes();
      console.log(initialNotes);
      setLoaded(true);
      setStickyNotes(initialNotes);
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      setError(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loaded) {
      initialLoad();
      Notification.requestPermission();
    } else {
      localStorage.setItem("sticky-notes", JSON.stringify(stickyNotes));
    }
  }, [stickyNotes, loaded]);
  
  const onChangeTitle = (updVal: any) => {
    setTitleInput(updVal.target.value);
  };
  const onChangeBody = (updVal: any) => {
    setBodyInput(updVal.target.value);
  };
  const onChangeBgColor = (updVal: any) => {
    setBgColorInput(updVal.target.value);
  };
  const onChangeMinutes = (updVal: any) => {
    setMinutesInput(updVal.target.value);
  };

  return (
  <>
      <div className={hdrStyle}>
        <h1>Sticky notes</h1>
        <label className={labelStyle}>
          Titulo: <input className={inputStyle} value={titleInput} onChange={onChangeTitle} />
        </label>
        <label className={labelStyle}>
          Body: <input className={inputStyle} value={bodyInput} onChange={onChangeBody} />
        </label>
        <label className={labelStyle}>
          BGColor: <input className={inputStyle} value={bgColorInput} onChange={onChangeBgColor} />
        </label>
        <label className={labelStyle}>
          Minutos: <input className={inputStyle} value={minutesInput} onChange={onChangeMinutes} />
        </label >
        <button className={btnStyle} onClick={onAddStickyNote}>Agregar</button>
      </div>
      <h2 className={`m-auto mb-5 ${titleStyle}`}>Notas:</h2>
      {(() => {
        if (stickyNotes.length > 0) {
          return stickyNotes.map(sn => (
                <StickyNoteComp key={sn.id} id={sn.id} title={sn.title} body={sn.body} bgColor={sn.bgColor} validUntil={sn.validUntil.toString()} onDelete={() => {
              const i = stickyNotes.indexOf(sn);
              setStickyNotes([...stickyNotes.slice(0,i), ...stickyNotes.slice(i+1)]);
            }} onEditedFields={(nTitle, nBody, nBgColor, validUntil) => {
                const i = stickyNotes.indexOf(sn);
                stickyNotes[i] = { id: sn.id, title: nTitle, body: nBody, bgColor: nBgColor, validUntil: validUntil };
                setStickyNotes(stickyNotes.slice());
              }}></StickyNoteComp>
          ));
        } else {
          return null;
      }})()}
  </>
  );
};
