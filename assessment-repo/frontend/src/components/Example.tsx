import { useState } from "react";

export default function Example() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h2>Example Component</h2>
      <button
        onClick={() => setClicked(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {clicked ? "Clicked!" : "Click me"}
      </button>
    </div>
  );
}
