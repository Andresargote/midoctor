import React from 'react';

export default function Logo({ width = 18, color = '#0A0A0A', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      fill="none"
      viewBox="0 0 56 17"
      {...props}
    >
      <path
        stroke={color}
        strokeWidth="1.5"
        d="M20 14s.393 2.03 3.142 2.03c2.749 0 3.141-2.03 3.141-2.03"
      ></path>
      <path
        fill={color}
        d="M10.284 4.576V13H8.232V7.948L6.348 13H4.692L2.796 7.936V13H.744V4.576h2.424l2.364 5.832 2.34-5.832h2.412zm2.508 1.032c-.36 0-.656-.104-.888-.312a1.058 1.058 0 01-.336-.792c0-.32.112-.584.336-.792.232-.216.528-.324.888-.324.352 0 .64.108.864.324.232.208.348.472.348.792 0 .312-.116.576-.348.792-.224.208-.512.312-.864.312zm1.02.696V13H11.76V6.304h2.052zM14.89 9.64c0-.688.128-1.292.384-1.812.264-.52.62-.92 1.068-1.2.448-.28.948-.42 1.5-.42.44 0 .84.092 1.2.276.368.184.656.432.864.744V4.12h2.052V13h-2.052v-.96a2.08 2.08 0 01-.828.768c-.352.192-.764.288-1.236.288-.552 0-1.052-.14-1.5-.42a3.038 3.038 0 01-1.068-1.212c-.256-.528-.384-1.136-.384-1.824zm5.016.012c0-.512-.144-.916-.432-1.212a1.365 1.365 0 00-1.032-.444c-.408 0-.756.148-1.044.444-.28.288-.42.688-.42 1.2s.14.92.42 1.224c.288.296.636.444 1.044.444.408 0 .752-.148 1.032-.444.288-.296.432-.7.432-1.212zm6.584 3.444c-.656 0-1.248-.14-1.776-.42-.52-.28-.932-.68-1.236-1.2-.296-.52-.444-1.128-.444-1.824 0-.688.152-1.292.456-1.812.304-.528.72-.932 1.248-1.212.528-.28 1.12-.42 1.776-.42.656 0 1.248.14 1.776.42.528.28.944.684 1.248 1.212.304.52.456 1.124.456 1.812s-.156 1.296-.468 1.824c-.304.52-.724.92-1.26 1.2-.528.28-1.12.42-1.776.42zm0-1.776c.392 0 .724-.144.996-.432.28-.288.42-.7.42-1.236s-.136-.948-.408-1.236a1.28 1.28 0 00-.984-.432c-.4 0-.732.144-.996.432-.264.28-.396.692-.396 1.236 0 .536.128.948.384 1.236.264.288.592.432.984.432zm4.185-1.668c0-.696.14-1.304.42-1.824.288-.52.684-.92 1.188-1.2.512-.28 1.096-.42 1.752-.42.84 0 1.54.22 2.1.66.568.44.94 1.06 1.116 1.86h-2.184c-.184-.512-.54-.768-1.068-.768-.376 0-.676.148-.9.444-.224.288-.336.704-.336 1.248s.112.964.336 1.26c.224.288.524.432.9.432.528 0 .884-.256 1.068-.768h2.184c-.176.784-.548 1.4-1.116 1.848-.568.448-1.268.672-2.1.672-.656 0-1.24-.14-1.752-.42-.504-.28-.9-.68-1.188-1.2-.28-.52-.42-1.128-.42-1.824zM42.08 11.26V13h-1.044c-.743 0-1.323-.18-1.74-.54-.415-.368-.623-.964-.623-1.788V8.008h-.816V6.304h.816V4.672h2.051v1.632h1.344v1.704h-1.344v2.688c0 .2.048.344.145.432.096.088.256.132.48.132h.731zm4.191 1.836c-.655 0-1.247-.14-1.776-.42-.52-.28-.931-.68-1.236-1.2-.295-.52-.444-1.128-.444-1.824 0-.688.152-1.292.456-1.812.305-.528.72-.932 1.248-1.212.528-.28 1.12-.42 1.776-.42.657 0 1.248.14 1.776.42.528.28.944.684 1.248 1.212.304.52.456 1.124.456 1.812s-.156 1.296-.468 1.824c-.303.52-.724.92-1.26 1.2-.528.28-1.12.42-1.776.42zm0-1.776c.392 0 .724-.144.997-.432.28-.288.42-.7.42-1.236s-.136-.948-.408-1.236a1.28 1.28 0 00-.984-.432c-.4 0-.732.144-.996.432-.265.28-.397.692-.397 1.236 0 .536.128.948.384 1.236.265.288.593.432.985.432zm6.645-3.9c.24-.368.54-.656.9-.864.36-.216.76-.324 1.2-.324v2.172h-.564c-.512 0-.896.112-1.152.336-.256.216-.384.6-.384 1.152V13h-2.052V6.304h2.052V7.42z"
      ></path>
    </svg>
  );
}
