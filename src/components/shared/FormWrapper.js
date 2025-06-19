import React from "react";

/**
 * COMPONENT:=> GENERAL BIG BUTTON:
 * @param: children [the inputs and lables combined and passed to this component]
 * AUTHOR BY: [SENU 🇪🇬]
*/

export default function FormWrapper({ children, className }) {
  return (
    <div className={className}>
      <form encType="multipart/form-data" className="form-wrapper">
        {children}
      </form>
    </div>
  );
}
