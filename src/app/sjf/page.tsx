"use client";

import { FormEvent, useEffect, useState } from "react";

// define SJFProcess type, an object with AT and BT
type SJFProcess = {
  name: string;
  at: string;
  bt: string;
  wt: number;
  tt: number;
};

export default function SJF() {
  // store these variables as state
  const [numOfProcess, setNumOfProcess] = useState<string>("");
  const [processes, setProcesses] = useState<SJFProcess[]>([]);
  const [results, setResults] = useState<
    { at: number; bt: number; name: string; wt: number; tt: number }[]
  >([]);
  const [averages, setAverages] = useState<number[]>([]);

  useEffect(() => {
    setResults([]);
  }, [processes]);

  useEffect(() => {
    let averages = [0, 0];

    results.forEach((process) => {
      averages[0] += process.wt;
      averages[1] += process.tt;
    });

    averages[0] = averages[0] / results.length;
    averages[1] = averages[1] / results.length;

    setAverages(averages);
  }, [results]);

  // after clicking the OK button, populate the proccesses[] with
  // empty SJFProcess object
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n = Number(numOfProcess);

    if (n < 2 || n > 9) {
      alert("Please enter minimum of 2, maximum of 9 only.");
      return;
    }

    const newProcesses: SJFProcess[] = [];
    const j = Number(numOfProcess);
    for (let i = 0; i < j; i++) {
      newProcesses.push({ name: `P${i}`, at: "", bt: "", wt: 0, tt: 0 });
    }

    setProcesses(newProcesses);
  };

  const handleATChange = (i: number, value: string): void => {
    const newProcesses = processes.map((process, index) => {
      if (index === i) {
        return { ...process, at: value };
      }

      return process;
    });

    setProcesses(newProcesses);
  };

  const handleBTChange = (i: number, value: string): void => {
    const newProcesses = processes.map((process, index) => {
      if (index === i) {
        return { ...process, bt: value };
      }

      return process;
    });

    setProcesses(newProcesses);
  };

  const calculateSJF = () => {
    // Parse arrival times and burst times as integers
    const parsedProcesses = processes.map((process) => ({
      ...process,
      at: Number(process.at),
      bt: Number(process.bt),
    }));

    // Sort processes based on arrival time
    const sortedProcesses = parsedProcesses.sort((a, b) => a.at - b.at);

    // Initialize variables for turnaround time and waiting time
    let currentTime = 0;
    let scheduledQueue = [];
    let waitingQueue = [];

    while (scheduledQueue.length !== processes.length) {
      // prepare waiting queue by pushing the process with arrival time less than or equal the current time
      // and popping the process from the sorted processes to avoid duplication
      let i = 0;
      while (i < sortedProcesses.length) {
        if (sortedProcesses[i].at <= currentTime) {
          waitingQueue.push(sortedProcesses.at(i));
          sortedProcesses.splice(i, 1);
          continue; // we continue and not increment index, because items will shift to the left after popping the item at index [i]
        }

        i += 1;
      }

      // if waiting queue is empty, increment time and go back to while loop start
      if (waitingQueue.length === 0) {
        currentTime += 1;
        continue;
      }

      // sort waiting queue based on process.bt
      waitingQueue.sort((a, b) => a!!.bt - b!!.bt);

      // select the process with lowest BT, and set the time += BT since not preemptive
      let selectProcess = waitingQueue[0]!!;
      scheduledQueue.push(selectProcess);
      waitingQueue.splice(0, 1);

      currentTime += selectProcess.bt;
    }

    // calculate waiting times and turnaround times
    let time = scheduledQueue[0].at;
    for (let process of scheduledQueue) {
      if (time < process.at) {
        time = process.at;
      }
      process.wt = time - process.at;
      time += process.bt;
      process.tt = time - process.at;
    }

    setResults(scheduledQueue);
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateSJF();
        }}
        className="mb-16"
      >
        {processes.map((process, i) => (
          <div key={i} className="my-2 grid grid-cols-3">
            <p>P{i}</p>
            <input
              type="number"
              min={0}
              required
              className="remove_arrow w-1/2 rounded-md border px-2"
              placeholder={`AT for P${i}`}
              value={processes[i].at}
              onChange={(e) => handleATChange(i, e.target.value)}
            />
            <input
              type="number"
              min={0}
              required
              className="remove_arrow w-1/2 rounded-md border px-2"
              placeholder={`BT for P${i}`}
              value={processes[i].bt}
              onChange={(e) => handleBTChange(i, e.target.value)}
            />
          </div>
        ))}

        {processes.length > 0 && (
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
          >
            Calculate
          </button>
        )}
      </form>

      {results.length !== 0 && (
        <div className="rounded-3xl border border-blue-200 p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold text-blue-600">Results</h2>

          <table className="my-8 w-1/2 min-w-fit text-left ">
            <thead>
              <tr className="grid grid-cols-3">
                <th>PID</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
              </tr>
            </thead>

            <tbody>
              {results.map((process) => (
                <tr key={process.name} className="grid grid-cols-3">
                  <td>{process.name}</td>
                  <td>{process.wt}</td>
                  <td>{process.tt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Average waiting time:{" "}
            <span className="font-bold">{averages[0]} ms</span>
          </p>
          <p>
            Average turnaround{" "}
            <span className="font-bold">{averages[1]} ms</span>
          </p>
        </div>
      )}
    </>
  );
}
