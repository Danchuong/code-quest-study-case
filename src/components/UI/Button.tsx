import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  href?: never;
} & ComponentPropsWithoutRef<"button">;

type AnchorProps = {
  href?: string;
} & ComponentPropsWithoutRef<"a">;

function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps {
  return "href" in props;
}

export default function Button(props: ButtonProps | AnchorProps) {
  if (isAnchorProps(props)) {
    return <a className="button" {...props} />;
  }
  return <button className="button" {...props}></button>;
}
