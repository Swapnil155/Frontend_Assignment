import React, { Fragment, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";
import "./index.css";

const data = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

function SelectInput() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function handleInput(event) {
    setInputValue(event.target.value);

    setSuggestions(
      data.filter((city) =>
        city.toLowerCase().startsWith(event.target.value.toLowerCase())
      )
    );
  }

  function handleSelection(event) {
    setInputValue(event.target.innerText);
    setSuggestions([]);
  }
  function onBlurHandle(e) {
    setInputValue(e.target.innerText);
    setSuggestions([]);
  }

  console.log(inputValue);

  return (
    <Fragment>
      <Container className="py-6">
        <div className="inputBox">
          <input
            className="inputFiled"
            value={inputValue}
            // value={inputValue}
            onKeyUp={handleInput}
            
            type="text"
            required="required"
          />
          <span> Email</span>
          <ListGroup>
          {suggestions.map((suggestion) => (
            <ListGroup.Item key={suggestion} onClick={handleSelection}>
              {suggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>
        </div>
        <div className="inputBox">
          {/* <input
          type="text"
          className="inputFiled"
          placeholder="Enter a location"
          value={inputValue}
          onInput={handleInput}
          // onInvalid={onBlurHandle}
          // onBlur={onBlurHandle}
        />
         <span> Email</span> */}
        </div>
        
        
      </Container>
    </Fragment>
  );
}

export default SelectInput;
