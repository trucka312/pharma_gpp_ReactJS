export const IKIPOS = "IKIPOS";
export const BENITH = "BENITH";
export const IKIFB = "IKIFB";

export default function getChannel() {
  if (window.location.href.includes("pos.")) {
    return IKIPOS;
  }

  return BENITH;
}
