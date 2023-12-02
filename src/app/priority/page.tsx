"use client";

import { FormEvent, useState } from "react";

// define PriorityProcess type, an object with AT, BT, and Priority
type SJFProcess = {
  name: string;
  at: string;
  bt: string;
  prio: string;
  rt: number;
  wt: number;
  tt: number;
};

export default function Priority() {
  // store these variables as state
  const [numOfProcess, setNumOfProcess] = useState<string>("");
  const [processes, setProcesses] = useState<SJFProcess[]>([]);

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
      newProcesses.push({
        name: `P${i}`,
        at: "",
        bt: "",
        prio: "",
        rt: 0,
        wt: 0,
        tt: 0,
      });
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

  const handlePrioChange = (i: number, value: string): void => {
    const newProcesses = processes.map((process, index) => {
      if (index === i) {
        return { ...process, prio: value };
      }

      return process;
    });

    setProcesses(newProcesses);
  };

  const calculatePriority = () => {
    // Parse arrival times and burst times as integers
    const parsedProcesses = processes.map((process) => ({
      ...process,
      at: Number(process.at),
      bt: Number(process.bt),
      prio: Number(process.prio),
      remain: Number(process.bt), // include remaining time in preemptive mode
    }));

    // Sort processes based on arrival time
    const sortedProcesses = parsedProcesses.sort((a, b) => a.at - b.at);

    // Initialize variables for turnaround time and waiting time
    let currentTime = 0;
    let scheduledQueue: {
      at: number;
      bt: number;
      prio: number;
      remain: number;
      name: string;
      rt: number;
      wt: number;
      tt: number;
    }[] = [];
    let waitingQueue = [];
    let selectProcess;
    let done: boolean = false;

    while (true) {
      if (scheduledQueue.length !== 0) {
        let processesNames = [];
        for (let process of processes) {
          processesNames.push(process.name);
        }

        processesNames.sort();

        let scheduledNames: any[] = [];
        for (let process of scheduledQueue) {
          if (!scheduledNames.includes(process.name)) {
            scheduledNames.push(process.name);
          }
        }

        scheduledNames.sort();

        // if scheduledNames does not include every processes yet, continue
        if (JSON.stringify(processesNames) === JSON.stringify(scheduledNames)) {
          done = true;

          for (let i = 0; i < scheduledQueue.length; i++) {
            if (scheduledQueue[i].remain !== 0) {
              done = false;
              break;
            }
          }
        }
      }

      if (done) {
        break;
      }

      // prepare waiting queue by pushing the process with arrival time equal to the current time
      // and popping the process from the sorted processes to avoid duplication
      let i = 0;
      while (i < sortedProcesses.length) {
        if (sortedProcesses[i].at === currentTime) {
          waitingQueue.push(sortedProcesses.at(i));
          sortedProcesses.splice(i, 1);
          continue; // we continue and not increment index, because items will shift to the left after popping the item at index [i]
        }

        i += 1;
      }

      if (selectProcess !== undefined && selectProcess.remain !== 0) {
        waitingQueue.push(selectProcess);
      }

      // if waiting queue is empty, increment time and go back to while loop start
      if (waitingQueue.length === 0) {
        currentTime += 1;
        continue;
      }

      // sort waiting queue based on process.priority
      waitingQueue.sort((a, b) => a!!.prio - b!!.prio);

      // execute priority process until new process arrives
      selectProcess = waitingQueue[0]!!;
      selectProcess.remain = selectProcess.remain - 1;

      if (scheduledQueue.length === 0) {
        scheduledQueue.push(selectProcess);
        waitingQueue.splice(0, 1);
        currentTime += 1;
        continue;
      }

      if (
        selectProcess.name === scheduledQueue[scheduledQueue.length - 1].name
      ) {
        scheduledQueue[scheduledQueue.length - 1] = selectProcess;
      } else {
        scheduledQueue.push(selectProcess);
      }
      waitingQueue.splice(0, 1);

      currentTime += 1;
    }

    for (let process of scheduledQueue) {
      console.log(process);
    }
  };

  return (
    <>
      <h1 className="mb-2 text-4xl font-bold text-blue-600">
        Preemptive Priority
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
          className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700 active:bg-black"
        >
          OK
        </button>
      </form>

      <div className="mt-8 grid grid-cols-4">
        <p className="font-bold">Process</p>
        <p className="font-bold">Arrival Time</p>
        <p className="font-bold">Burst Time</p>
        <p className="font-bold">Priority</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculatePriority();
        }}
        className="mb-16"
      >
        {processes.map((process, i) => (
          <div key={i} className="my-2 grid grid-cols-4">
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
              min={1}
              required
              className="remove_arrow w-1/2 rounded-md border px-2"
              placeholder={`BT for P${i}`}
              value={processes[i].bt}
              onChange={(e) => handleBTChange(i, e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={9}
              required
              className="remove_arrow w-1/2 rounded-md border px-2"
              placeholder="1 - 9"
              value={processes[i].prio}
              onChange={(e) => handlePrioChange(i, e.target.value)}
            />
          </div>
        ))}

        {processes.length > 0 && (
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700 active:bg-black"
          >
            Calculate
          </button>
        )}
      </form>

      {/* {results.length !== 0 && (
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
      )} */}
    </>
  );
}
