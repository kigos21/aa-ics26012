"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  currentPosition: number;
  trackSize: number;
  seekRate: number;
  requests: string;
};

type Result = {
  totalHeadMovement: number;
  seekTime: number;
};

export default function Scan() {
  const [result, setResult] = useState<Result>({
    totalHeadMovement: 0,
    seekTime: 0,
  });

  const Scan = (
    arr: number[],
    head: number,
    direction: "left" | "right",
    trackSize: number,
    rate: number,
  ): Result => {
    let totalHeadMovement = 0;
    let distance;
    let curTrack;
    let left = [];
    let right = [];
    let seekSequence = [];

    // appending end values
    // which has to be visited
    // before reversing the direction
    if (direction == "left") left.push(0);
    else if (direction == "right") right.push(trackSize - 1);

    const size = arr.length;
    for (let i = 0; i < size; i++) {
      if (arr[i] < head) left.push(arr[i]);
      if (arr[i] > head) right.push(arr[i]);
    }

    // sorting left and right vectors
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);

    // run the while loop two times.
    // one by one scanning right
    // and left of the head
    let run = 2;
    while (run-- > 0) {
      if (direction == "left") {
        for (let i = left.length - 1; i >= 0; i--) {
          curTrack = left[i];

          // appending current track to seek sequence
          seekSequence.push(curTrack);

          // calculate absolute distance
          distance = Math.abs(curTrack - head);

          // increase the total count
          totalHeadMovement += distance;

          // accessed track is now the new head
          head = curTrack;
        }

        direction = "right";
      } else if (direction == "right") {
        for (let i = 0; i < right.length; i++) {
          curTrack = right[i];

          // appending current track to seek sequence
          seekSequence.push(curTrack);

          // calculate absolute distance
          distance = Math.abs(curTrack - head);

          // increase the total count
          totalHeadMovement += distance;

          // accessed track is now new head
          head = curTrack;
        }

        direction = "left";
      }
    }

    return { totalHeadMovement, seekTime: totalHeadMovement / rate };
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let requests: number[] | string[] = data.requests
      .split(" ")
      .filter((value) => value != "");
    requests = requests.map((request) => Number(request));

    const result = Scan(
      requests,
      data.currentPosition,
      "left",
      data.trackSize,
      data.seekRate,
    );

    setResult(result);
  };

  let currentPosition = watch("currentPosition");
  let trackSize = watch("trackSize");
  let seekRate = watch("seekRate");
  let requests = watch("requests");

  return (
    <>
      <h1 className="mb-2 text-4xl font-bold text-blue-600">Scan</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-blue-200 p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="trackSize">Track Size</label>
            <input
              type="number"
              id="trackSize"
              className="remove_arrow mt-1 w-full rounded-md border px-2 py-1"
              placeholder="64 - 246"
              {...register("trackSize", {
                required: true,
                min: 64,
                max: 256,
                validate: (value) => value >= 64 && value <= 256,
              })}
            />
            {errors.trackSize && (
              <p className="px-1 py-2 text-xs text-red-600">
                This field is required: min of 64, max of 256 only
              </p>
            )}

            <label htmlFor="seekRate" className="mt-5 block">
              Seek Rate
            </label>
            <input
              type="number"
              id="seekRate"
              className="remove_arrow mt-1 w-full rounded-md border px-2 py-1"
              placeholder="e.g. 4"
              {...register("seekRate", { required: true, min: 1 })}
            />
            {errors.seekRate && (
              <p className="px-1 py-2 text-xs text-red-600">
                This field is required: minimum of 1
              </p>
            )}

            <label htmlFor="currentPosition" className="mt-5 block">
              Current Position
            </label>
            <input
              type="number"
              id="currentPosition"
              className="remove_arrow mt-1 w-full rounded-md border px-2 py-1"
              placeholder={`e.g. 10`}
              {...register("currentPosition", {
                required: true,
                min: 0,
                max: trackSize,
              })}
            />
            {errors.currentPosition && (
              <p className="px-1 py-2 text-xs text-red-600">
                This field is required: min of 0, max of your track size
              </p>
            )}

            <label htmlFor="requests" className="mt-5 block">
              Location Requests
            </label>
            <input
              type="text"
              id="requests"
              className="remove_arrow mt-1 w-full rounded-md border px-2 py-1"
              placeholder="e.g. 0 2 4 6 8"
              {...register("requests", {
                required: true,
                validate: (value) => {
                  const values: string[] = value
                    .split(" ")
                    .filter((value) => value != "");
                  for (let n of values) {
                    if (Number(n) < 0 || Number(n) > trackSize) {
                      return false;
                    }
                  }
                  return values.length > 0 && values.length <= 10;
                },
              })}
            />
            {errors.requests && (
              <p className="px-1 py-2 text-xs text-red-600">
                This field is required: min of 1 request, max of 10 requests.
                Make sure to <span className="font-bold">stay in range</span>{" "}
                between 0 and your track size!
              </p>
            )}

            <button
              type="submit"
              className="mt-5 rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700 active:bg-black"
            >
              Calculate
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-blue-200 p-8 shadow-lg">
          <p className="text-xl font-bold">Results</p>
          {result.totalHeadMovement !== 0 && (
            <>
              <p>
                Total Head Movement:{" "}
                <span className="font-bold">{result.totalHeadMovement}</span>
              </p>
              <p>
                Seek Time:{" "}
                <span className="font-bold">{result.seekTime} ms</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
