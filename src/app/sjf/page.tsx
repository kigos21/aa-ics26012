"use client";

import { FormEvent, useEffect, useState } from "react";

type SJFProcess = { AT: string; BT: string };

export default function SJF() {
  const [numOfProcess, setNumOfProcess] = useState<string>();
  const [processes, setProcesses] = useState<SJFProcess[]>([]);

  useEffect(() => {
    console.log(processes);
  }, [processes]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Number of processses: ${numOfProcess}`);

    const newProcesses: SJFProcess[] = [];
    const j = Number(numOfProcess);
    for (let i = 0; i < j; i++) {
      newProcesses.push({ AT: "", BT: "" });
    }

    setProcesses(newProcesses);
  };

  const handleATChange = (i: number, value: string): void => {
    const newProcesses = processes.map((process, index) => {
      if (index === i) {
        return { ...process, AT: value };
      }

      return process;
    });

    setProcesses(newProcesses);
  };

  const handleBTChange = (i: number, value: string): void => {
    const newProcesses = processes.map((process, index) => {
      if (index === i) {
        return { ...process, BT: value };
      }

      return process;
    });

    setProcesses(newProcesses);
  };

  return (
    <>
      <h1 className="mb-2 text-4xl font-bold text-blue-600">
        Shortest Job First
      </h1>

      <form action="" onSubmit={(e) => handleSubmit(e)} className="flex gap-1">
        <input
          type="number"
          className="remove_arrow rounded-md border px-2"
          placeholder="Enter number of processes"
          required
          value={numOfProcess}
          onChange={(e) => setNumOfProcess(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
        >
          OK
        </button>
      </form>

      <div className="mt-8 grid grid-cols-3">
        <p className="font-bold">Process</p>
        <p className="font-bold">Arrival Time</p>
        <p className="font-bold">Burst Time</p>
      </div>
      {processes.map((process, i) => (
        <form key={i} action="" className="my-2 grid grid-cols-3">
          <p>P{i}</p>
          <input
            type="number"
            className="remove_arrow w-1/2 rounded-md border px-2"
            placeholder={`AT for P${i}`}
            value={processes[i].AT}
            onChange={(e) => handleATChange(i, e.target.value)}
          />
          <input
            type="number"
            className="remove_arrow w-1/2 rounded-md border px-2"
            placeholder={`BT for P${i}`}
            value={processes[i].BT}
            onChange={(e) => handleBTChange(i, e.target.value)}
          />
        </form>
      ))}
    </>
  );
}
