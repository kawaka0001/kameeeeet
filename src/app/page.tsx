"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Meet
          </h1>
          <p className="text-xl mb-8">
            Wasm-powered video conferencing
          </p>
          <a
            href="/room/test"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Test Room
          </a>
        </div>
      </div>
    </main>
  );
}
