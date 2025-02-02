import PlusIcon from "components/img/Plus";
import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import { ActionTypes, StyleVariables } from "helpers/Constants";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { PopperProps } from "cdm/RowSelectModel";
import { CellContext } from "components/contexts/CellContext";

const PopperSelectPortal = (popperProps: PopperProps) => {
  const { dispatch, row, column, columns, note, state } = popperProps;
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);
  // Selector reference state
  const [selectRef, setSelectRef] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(selectRef, selectPop);
  const [showAdd, setShowAdd] = useState(false);
  // Selector popper state
  const [domReady, setDomReady] = useState(false);

  React.useEffect(() => {
    setDomReady(true);
  });
  function handleAddOption(e: any) {
    setShowAdd(true);
  }

  function handleOptionClick(option: { label: string; backgroundColor?: any }) {
    setContextValue({ value: option.label, update: true });
    setShowSelect(false);
    // save on disk & move file if its configured on the column
    dispatch({
      type: ActionTypes.UPDATE_OPTION_CELL,
      file: note.getFile(),
      key: (column as any).key,
      value: option.label,
      row: row,
      columnId: column.id,
      state: state,
    });
  }

  function handleOptionBlur(e: any) {
    if (e.target.value !== "") {
      dispatch({
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: (column as any).id,
      });
    }
    setShowAdd(false);
  }

  /**
   *
   * @param e Handler for click event on cell
   */
  function handleOptionKeyDown(e: any) {
    if (e.key === "Enter") {
      if (e.target.value !== "") {
        dispatch({
          columns: columns,
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId: (column as any).id,
          type: ActionTypes.ADD_OPTION_TO_COLUMN,
        });
      }
      setShowAdd(false);
    }
  }

  function getColor() {
    const match = (column as any).options.find(
      (option: { label: any }) => option.label === contextValue.value
    );
    return (match && match.backgroundColor) || grey(200);
  }

  function PortalSelect() {
    return (
      <div>
        {/* hide selector if click outside of it */}
        {showSelect && (
          <div className="overlay" onClick={() => setShowSelect(false)} />
        )}
        {/* show selector if click on the current value */}
        {showSelect && (
          <div
            className="menu"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 200,
              maxWidth: 320,
              padding: "0.75rem",
              background: StyleVariables.BACKGROUND_SECONDARY,
            }}
          >
            <div
              className="d-flex flex-wrap-wrap"
              style={{ marginTop: "-0.5rem" }}
            >
              {column.options.map((option: any) => (
                <div
                  key={option.label}
                  className="cursor-pointer"
                  style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                  onClick={() => handleOptionClick(option)}
                >
                  <Relationship
                    value={option.label}
                    backgroundColor={option.backgroundColor}
                  />
                </div>
              ))}
              {showAdd && (
                <div
                  style={{
                    marginRight: "0.5rem",
                    marginTop: "0.5rem",
                    width: 120,
                    padding: "2px 4px",
                    borderRadius: 4,
                  }}
                >
                  <input
                    type="text"
                    className="option-input"
                    onBlur={handleOptionBlur}
                    ref={setAddSelectRef}
                    onKeyDown={handleOptionKeyDown}
                  />
                </div>
              )}
              <div
                className="cursor-pointer"
                style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                onClick={handleAddOption}
              >
                <Relationship
                  value={
                    <span className="svg-icon-sm svg-text">
                      <PlusIcon />
                    </span>
                  }
                  backgroundColor={grey(200)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Current value of the select */}
      <div
        ref={setSelectRef}
        className="cell-padding d-flex cursor-default align-items-center flex-1"
        onClick={() => setShowSelect(true)}
      >
        {contextValue.value && (
          <Relationship
            value={contextValue.value.toString()}
            backgroundColor={getColor()}
          />
        )}
      </div>
      {domReady
        ? ReactDOM.createPortal(
            PortalSelect(),
            document.getElementById("popper-container")
          )
        : null}
    </>
  );
};

export default PopperSelectPortal;
