"use client";

import { FormEvent, useEffect, useState } from "react";

type PrioProcess = {
  at: number;
  bt: number;
  prio: number;
  remain: number;
  name: string;
  rt: number;
  wt: number;
  tt: number;
};

type InputPrioProcess = {
  name: string;
  at: string;
  bt: string;
  prio: string;
};

export default function Priority() {
  // store these variables as state
  const [numOfProcess, setNumOfProcess] = useState<string>("");
  const [processes, setProcesses] = useState<InputPrioProcess[]>([]);
  const [results, setResults] = useState<PrioProcess[]>([]);
  const [averages, setAverages] = useState<{
    rt: number;
    wt: number;
    tt: number;
  }>({ rt: 0, wt: 0, tt: 0 });

  useEffect(() => {
    setResults([]);
  }, [processes]);

  useEffect(() => {
    let newAverages = { rt: 0, wt: 0, tt: 0 };

    results.forEach((process) => {
      newAverages.rt += process.rt;
      newAverages.wt += process.wt;
      newAverages.tt += process.tt;
    });

    newAverages.rt = newAverages.rt / results.length;
    newAverages.wt = newAverages.wt / results.length;
    newAverages.tt = newAverages.tt / results.length;

    setAverages(newAverages);
  }, [results]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n = Number(numOfProcess);

    if (n < 2 || n > 9) {
      alert("Please enter minimum of 2, maximum of 9 only.");
      return;
    }

    const newProcesses: InputPrioProcess[] = [];
    const j = Number(numOfProcess);
    for (let i = 0; i < j; i++) {
      newProcesses.push({
        name: `P${i}`,
        at: "",
        bt: "",
        prio: "",
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

  // Function to convert the input array to the desired format
  function convertToPrioProcess(
    inputProcesses: InputPrioProcess[],
  ): PrioProcess[] {
    return inputProcesses.map((process, index) => ({
      at: parseInt(process.at),
      bt: parseInt(process.bt),
      prio: parseInt(process.prio),
      remain: parseInt(process.bt),
      name: process.name,
      rt: 0,
      wt: 0,
      tt: 0,
    }));
  }

  // Function for Preemptive Priority CPU Scheduling
  function preemptivePriorityScheduling(
    processes: PrioProcess[],
  ): PrioProcess[] {
    const n = processes.length;
    const order: PrioProcess[] = [];
    let currentTime = 0;

    let processNames: string[] = [];
    processes.forEach((process) => {
      if (!processNames.includes(process.name)) {
        processNames.push(process.name);
      }
    });
    processNames.sort();

    let orderNames: string[] = [];

    while (true) {
      console.log("Order length is now: " + order.length);

      let highestPriorityIndex = -1;
      let highestPriority = 10;

      console.log("before for loop...");
      for (let i = 0; i < n; i++) {
        if (
          processes[i].at <= currentTime &&
          processes[i].remain > 0 &&
          processes[i].prio < highestPriority
        ) {
          highestPriority = processes[i].prio;
          highestPriorityIndex = i;
        }
      }

      console.log("before for priorityIndex");
      if (highestPriorityIndex === -1) {
        console.log("before for JSON stringify check...");
        if (
          JSON.stringify(processNames) !== JSON.stringify(orderNames) ||
          order[order.length - 1].remain !== 0
        ) {
          console.log("incrementing time" + currentTime);
          currentTime += 1;
          continue;
        }

        // No process is ready to execute
        break;
      }

      const currentProcess = processes[highestPriorityIndex];

      if (currentProcess.rt === 0) {
        currentProcess.rt = currentTime - currentProcess.at;
      }

      currentTime++;
      currentProcess.remain--;

      if (currentProcess.remain === 0) {
        currentProcess.tt = currentTime - currentProcess.at;
        currentProcess.wt = currentProcess.tt - currentProcess.bt;
      }

      order.push({
        name: currentProcess.name,
        at: currentProcess.at,
        bt: currentProcess.bt,
        prio: currentProcess.prio,
        remain: currentProcess.remain,
        rt: currentProcess.rt,
        wt: currentProcess.wt,
        tt: currentProcess.tt,
      });

      console.log("before for pushing order name...");
      if (!orderNames.includes(currentProcess.name)) {
        orderNames.push(currentProcess.name);
      }
      orderNames.sort();
    }

    return order;
  }

  const optimizeResults = (prioProcesses: PrioProcess[]) => {
    let order: PrioProcess[] = [];

    let n = processes.length;
    for (let i = 0; i < n; i++) {
      let processById: PrioProcess[] = prioProcesses.filter(
        (process) => process.name === `P${i}`,
      );

      let firstProcess = processById[0];
      let lastIndex = processById.length - 1;
      let lastProcess = processById[lastIndex];
      order.push({ ...lastProcess, rt: firstProcess.rt });
    }

    return order;
  };

  const calculatePriority = () => {
    const parsedProcesses = convertToPrioProcess(processes);
    const schedulingOrder = preemptivePriorityScheduling(parsedProcesses);
    const optimizedOrder = optimizeResults(schedulingOrder);

    setResults(optimizedOrder);
  };

  return (
    <>
      <h1 className="mb-6 font-mono text-4xl font-bold text-stone-950">
        Preemptive Priority
      </h1>

      <form action="" onSubmit={(e) => handleSubmit(e)} className="flex gap-1">
        <input
          type="number"
          className="remove_arrow rounded-md border-4 border-amber-800 px-2 py-1"
          placeholder="Enter number of processes"
          required
          value={numOfProcess}
          onChange={(e) => setNumOfProcess(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 rounded-md bg-amber-800 px-2 py-1 text-white hover:bg-orange-600 active:bg-black"
        >
          OK
        </button>
      </form>

      <div className="mb-5 mt-8 grid grid-cols-4">
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
          <div key={i} className="my-2 mb-5 grid grid-cols-4">
            <p>P{i}</p>
            <input
              type="number"
              min={0}
              required
              className="remove_arrow w-1/2 rounded-md border-4 border-amber-800 px-2 py-1"
              placeholder={`AT for P${i}`}
              value={processes[i].at}
              onChange={(e) => handleATChange(i, e.target.value)}
            />
            <input
              type="number"
              min={1}
              required
              className="remove_arrow w-1/2 rounded-md border-4 border-amber-800 px-2 py-1"
              placeholder={`BT for P${i}`}
              value={processes[i].bt}
              onChange={(e) => handleBTChange(i, e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={9}
              required
              className="remove_arrow w-1/2 rounded-md border-4 border-amber-800 px-2 py-1"
              placeholder="1 - 9"
              value={processes[i].prio}
              onChange={(e) => handlePrioChange(i, e.target.value)}
            />
          </div>
        ))}

        {processes.length > 0 && (
          <button
            type="submit"
            className="mt-2 rounded-md bg-amber-800 px-2 py-1 text-white hover:bg-orange-600 active:bg-black"
          >
            Calculate
          </button>
        )}
      </form>

      {results.length !== 0 && (
        <div className="rounded-3xl border-8 border-amber-800 bg-amber-200 p-10 shadow-lg">
          <h2 className="mb-2 font-mono text-2xl font-bold text-stone-950">
            Results
          </h2>

          <table className="my-8 w-1/2 min-w-fit text-left ">
            <thead>
              <tr className="grid grid-cols-4">
                <th>PID</th>
                <th>Response Time</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
              </tr>
            </thead>

            <tbody>
              {results.map((process) => (
                <tr key={process.name} className="grid grid-cols-4">
                  <td>{process.name}</td>
                  <td>{process.rt}</td>
                  <td>{process.wt}</td>
                  <td>{process.tt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Average response time:{" "}
            <span className="font-bold">{averages.rt.toFixed(2)} ms</span>
          </p>
          <p>
            Average waiting time:{" "}
            <span className="font-bold">{averages.wt.toFixed(2)} ms</span>
          </p>
          <p>
            Average turnaround time:{" "}
            <span className="font-bold">{averages.tt.toFixed(2)} ms</span>
          </p>
        </div>
      )}
    </>
  );
}
