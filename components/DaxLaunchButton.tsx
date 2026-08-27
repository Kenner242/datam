"use client";

export default function DaxLaunchButton({ className, label = "Hablar con Dax" }: { className?: string; label?: string }) {
  function openDax() {
    window.dispatchEvent(new CustomEvent("datam:open-dax"));
  }

  return (
    <button type="button" onClick={openDax} className={className}>
      {label}
    </button>
  );
}
