import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-4xl">That design is not here.</h1>
      <p className="mt-4 leading-relaxed">Start again from a customer name and pick an opportunity.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Back to search
      </Link>
    </main>
  );
}
