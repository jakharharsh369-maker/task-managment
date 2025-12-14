import { useState } from "react";
import { TextInput } from "@mantine/core";
import classes from "../../css/FloatingLabelInput.module.css";

function FloatingLabelInput({ label, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const floating = value?.trim().length !== 0 || focused;

  return (
    <div className={classes.wrapper} data-floating={floating}>
      <label className={classes.label}>{label}</label>

      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        classNames={{ input: classes.input }}
      />
    </div>
  );
}

export default FloatingLabelInput;
