import { useEffect, useRef, useState } from "react";

export function OrderButton({ onOrderComplete, disabled = false }) {
  const buttonRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const styleId = "order-button-styles";

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        :root {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --dark: #1e293b;
          --grey-dark: #475569;
          --grey: #64748b;
          --grey-light: #cbd5e1;
          --white: #ffffff;
          --green: #16a34a;
          --sand: #f59e0b;
          --sand-light: #fbbf24;
        }

        .order {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border: 0;
          background: var(--dark);
          position: relative;
          height: 64px;
          width: 280px;
          padding: 0;
          outline: none;
          cursor: pointer;
          border-radius: 32px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 20px rgba(30, 41, 59, 0.3);
        }

        .order:hover {
          box-shadow: 0 8px 30px rgba(30, 41, 59, 0.4);
          transform: translateY(-2px);
        }

        .order:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 10px rgba(30, 41, 59, 0.2);
        }

        .order span {
          --o: 1;
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          top: 20px;
          line-height: 24px;
          color: var(--white);
          font-size: 17px;
          font-weight: 600;
          opacity: var(--o);
          transition: opacity 0.3s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .order span.default {
          transition-delay: 0.3s;
        }

        .order span.success {
          --offset: 16px;
          --o: 0;
          color: var(--white);
          font-weight: 700;
        }

        .order span.success svg {
          width: 14px;
          height: 12px;
          display: inline-block;
          vertical-align: top;
          fill: none;
          margin: 6px 0 0 6px;
          stroke: var(--white);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16px;
          stroke-dashoffset: var(--offset);
          transition: stroke-dashoffset 0.3s ease;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .order:active {
          transform: scale(0.96);
        }

        .order .lines {
          opacity: 0;
          position: absolute;
          height: 4px;
          background: var(--white);
          border-radius: 2px;
          width: 8px;
          top: 30px;
          left: 100%;
          box-shadow: 18px 0 0 var(--white), 36px 0 0 var(--white),
            54px 0 0 var(--white), 72px 0 0 var(--white), 90px 0 0 var(--white),
            108px 0 0 var(--white), 126px 0 0 var(--white), 144px 0 0 var(--white),
            162px 0 0 var(--white), 180px 0 0 var(--white), 198px 0 0 var(--white),
            216px 0 0 var(--white), 234px 0 0 var(--white), 252px 0 0 var(--white),
            270px 0 0 var(--white), 288px 0 0 var(--white), 306px 0 0 var(--white),
            324px 0 0 var(--white), 342px 0 0 var(--white), 360px 0 0 var(--white);
        }

        .order .back,
        .order .box {
          --start: var(--white);
          --stop: var(--grey-light);
          border-radius: 3px;
          background: linear-gradient(var(--start), var(--stop));
          position: absolute;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .order .truck {
          width: 65px;
          height: 45px;
          left: 100%;
          z-index: 1;
          top: 10px;
          position: absolute;
          transform: translateX(28px);
        }

        .order .truck:before,
        .order .truck:after {
          --r: -90deg;
          content: "";
          height: 3px;
          width: 22px;
          right: 62px;
          position: absolute;
          display: block;
          background: var(--white);
          border-radius: 2px;
          transform-origin: 100% 50%;
          transform: rotate(var(--r));
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .order .truck:before {
          top: 5px;
        }

        .order .truck:after {
          --r: 90deg;
          bottom: 5px;
        }

        .order .truck .back {
          left: 0;
          top: 0;
          width: 65px;
          height: 45px;
          z-index: 1;
        }

        .order .truck .front {
          overflow: hidden;
          position: absolute;
          border-radius: 3px 10px 10px 3px;
          width: 28px;
          height: 45px;
          left: 65px;
        }

        .order .truck .front:before,
        .order .truck .front:after {
          content: "";
          position: absolute;
          display: block;
        }

        .order .truck .front:before {
          height: 15px;
          width: 3px;
          left: 0;
          top: 15px;
          background: linear-gradient(var(--grey), var(--grey-dark));
        }

        .order .truck .front:after {
          border-radius: 3px 10px 10px 3px;
          background: var(--primary);
          width: 26px;
          height: 45px;
          right: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .order .truck .front .window {
          overflow: hidden;
          border-radius: 3px 9px 9px 3px;
          background: var(--primary-light);
          transform: perspective(5px) rotateY(3deg);
          width: 24px;
          height: 45px;
          position: absolute;
          left: 2px;
          top: 0;
          z-index: 1;
          transform-origin: 0 50%;
        }

        .order .truck .front .window:before,
        .order .truck .front .window:after {
          content: "";
          position: absolute;
          right: 0;
        }

        .order .truck .front .window:before {
          top: 0;
          bottom: 0;
          width: 16px;
          background: var(--dark);
        }

        .order .truck .front .window:after {
          width: 16px;
          top: 8px;
          height: 5px;
          position: absolute;
          background: rgba(255, 255, 255, 0.2);
          transform: skewY(14deg);
          box-shadow: 0 8px 0 rgba(255, 255, 255, 0.2);
        }

        .order .truck .light {
          width: 4px;
          height: 10px;
          left: 90px;
          transform-origin: 100% 50%;
          position: absolute;
          border-radius: 2px;
          transform: scaleX(0.8);
          background: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
        }

        .order .truck .light:before {
          content: "";
          height: 5px;
          width: 8px;
          opacity: 0;
          transform: perspective(3px) rotateY(-15deg) scaleX(0.94);
          position: absolute;
          transform-origin: 0 50%;
          left: 4px;
          top: 50%;
          margin-top: -2px;
          background: linear-gradient(
            90deg,
            #fbbf24,
            rgba(251, 191, 36, 0.7),
            rgba(251, 191, 36, 0)
          );
        }

        .order .truck .light.top {
          top: 5px;
        }

        .order .truck .light.bottom {
          bottom: 5px;
        }

        .order .box {
          --start: var(--sand-light);
          --stop: var(--sand);
          width: 24px;
          height: 24px;
          right: 100%;
          top: 20px;
        }

        .order .box:before,
        .order .box:after {
          content: "";
          top: 12px;
          position: absolute;
          left: 0;
          right: 0;
        }

        .order .box:before {
          height: 3px;
          margin-top: -1px;
          background: rgba(0, 0, 0, 0.15);
        }

        .order .box:after {
          height: 1px;
          background: rgba(0, 0, 0, 0.2);
        }

        .order.animate {
          background: linear-gradient(135deg, var(--dark) 0%, #0f172a 100%);
        }

        .order.animate .default {
          --o: 0;
          transition-delay: 0s;
        }

        .order.animate .success {
          --offset: 0;
          --o: 1;
          transition-delay: 7s;
          color: var(--white);
        }

        .order.animate .success svg {
          transition-delay: 7.3s;
          stroke: var(--white);
        }

        .order.animate .truck {
          animation: truck 10s ease forwards;
        }

        .order.animate .truck:before {
          animation: door1 2.4s ease forwards 0.3s;
        }

        .order.animate .truck:after {
          animation: door2 2.4s ease forwards 0.6s;
        }

        .order.animate .truck .light:before {
          animation: light 10s ease forwards;
        }

        .order.animate .box {
          animation: box 10s ease forwards;
        }

        .order.animate .lines {
          animation: lines 10s ease forwards;
        }

        @keyframes truck {
          10%, 30% {
            transform: translateX(-180px);
          }
          40% {
            transform: translateX(-120px);
          }
          60% {
            transform: translateX(-250px);
          }
          75%, 100% {
            transform: translateX(28px);
          }
        }

        @keyframes lines {
          0%, 30% {
            opacity: 0;
            transform: scaleY(0.8) translateX(0);
          }
          35%, 65% {
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: scaleY(0.8) translateX(-450px);
          }
        }

        @keyframes light {
          0%, 30% {
            opacity: 0;
            transform: perspective(3px) rotateY(-15deg) scaleX(0.88);
          }
          40%, 100% {
            opacity: 1;
            transform: perspective(3px) rotateY(-15deg) scaleX(0.94);
          }
        }

        @keyframes door1 {
          30%, 50% {
            transform: rotate(35deg);
          }
        }

        @keyframes door2 {
          30%, 50% {
            transform: rotate(-35deg);
          }
        }

        @keyframes box {
          8%, 10% {
            transform: translateX(45px);
            opacity: 1;
          }
          25% {
            transform: translateX(125px);
            opacity: 1;
          }
          26% {
            transform: translateX(125px);
            opacity: 0;
          }
          27%, 100% {
            transform: translateX(0px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  const handleClick = () => {
    if (!buttonRef.current || isAnimating || disabled) return;

    setIsAnimating(true);
    buttonRef.current.classList.add("animate");

    // Complete the order after animation
    setTimeout(() => {
      onOrderComplete();
      setIsAnimating(false);
      if (buttonRef.current) {
        buttonRef.current.classList.remove("animate");
      }
    }, 10000);
  };
  return (
    <button
      ref={buttonRef}
      className="order"
      onClick={handleClick}
      disabled={disabled || isAnimating}
    >
      <span className="default">Complete Order</span>
      <span className="success">
        Order Placed
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>
      <div className="box"></div>
      <div className="truck">
        <div className="back"></div>
        <div className="front">
          <div className="window"></div>
        </div>
        <div className="light top"></div>
        <div className="light bottom"></div>
      </div>
      <div className="lines"></div>
    </button>
  );
}
