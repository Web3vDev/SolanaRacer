"use client"

export function SlotMachineStyles() {
  return (
    <style jsx global>{`
      @keyframes casinoSpin {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-91%);
        }
      }
      
      .casino-reel {
        position: absolute;
        display: flex;
        flex-direction: column;
        animation: casinoSpin linear forwards;
        will-change: transform;
      }
      
      .casino-digit {
        height: 48px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: bold;
        color: inherit;
        flex-shrink: 0;
      }
      
      .static-digit {
        transform: translateY(0);
      }
      
      .text-green-400 {
        color: #4ade80;
      }
      
      .text-red-400 {
        color: #f87171;
      }

      .result-overlay {
        animation: fadeIn 0.3s ease-out forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .result-fade-out {
        animation: fadeOut 1s ease-out forwards;
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-50px);
        }
      }

      @keyframes casinoSpinFast {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-91%);
        }
      }

      .casino-reel-fast {
        position: absolute;
        display: flex;
        flex-direction: column;
        animation: casinoSpinFast 0.2s linear infinite;
        will-change: transform;
      }
    `}</style>
  )
}
