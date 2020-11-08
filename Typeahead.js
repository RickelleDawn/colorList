import React, { useState, useEffect, useRef } from 'react'
import "./Typeahead.css"

// functional component
function Typeahead(props) {


    // return focus to input box
    const inputBox = useRef(null)
    const onAction = () => {
        inputBox.current.focus();
    };



    // used to keep track of active search term 
    const [searchTerm, setSearchTerm] = useState("")

    // used to compile list of filtered results
    const [searchResult, setSearchResult] = useState([])

    // used to dictate whether or not the list should be open (list toggler)
    const [listOpen, setListOpen] = useState(false)

    // used to create interactive styling 
    const [inputName, setinputName] = useState("inputBoxClose")





    const list = props.list

    // filter through color list passed in as prop from index.js
    useEffect(() => {

        // creates updated search term that doesn't have white space or capital letters
        let newTerm = searchTerm.split(" ").join("").trim().toLowerCase()

        // checks that updated search term is still longer than 1 character (wasn't just white space) 
        if (newTerm.length >= 1 && listOpen) {
            setinputName("inputBoxOpen")

            // filter color list with updated search term (whitespace ignored/lowercase) to find matching items 
            const results = list.filter((color) =>
                color.toLowerCase().startsWith(newTerm)
            );

            // update search result list as long as there is 1 or more matching term
            if (results.length >= 1) {
                setSearchResult(results);
            }

            // ensures that if the result list is empty, the list display will not appear open
            else {
                setSearchResult([])
                setListOpen(false)
                setinputName("inputBoxClose")
            }




        }


        // list will close/remain closed if criteria above isn't met
        else {
            setSearchResult([])
            setListOpen(false)
            setinputName("inputBoxClose")
        }

    }, [searchTerm]);



    return (

        // clicking anywhere will close list 
        <div className="wrapper" onClick={() => {
            setListOpen(false)
            setinputName("inputBoxClose")
        }}>

            <div className="container">

                {/* by using a hook to control name of input box, I have more control over styling */}
                {/* using an on change event, the search term is constantly updating and being used to filter color list*/}
                {/* <div className="testWrapper" style={{ boxShadow: "5px 5px 26px -2px rgba(64,142,255,0.98)" }}> */}
                <input ref={inputBox} type="text" className={inputName} value={searchTerm} onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setListOpen(true)

                    // on key down event closes list if escape key (keycode 27) is pressed 
                }} placeholder="begin typing.." onKeyDown={(evt) => {
                    if (evt.keyCode === 27) {
                        setListOpen(false)
                        setinputName("inputBoxClose")

                    }
                }} />
            </div>

            <div className="listWrapper">
                {listOpen && (


                    <div className={"listDisplay"}>{searchResult.map((color, index) => (

                        // onclick event closes list, populates the rest of the selected term in the search bar, and returns focus to search bar 
                        <div className="listItem"><p onClick={() => {
                            setListOpen(false)
                            setSearchTerm(color)
                            onAction()

                            // on key down event closes list, populates the rest of the focused term 
                            // in the search bar, and returns focus to search bar if enter key (keycode 13) is pressed 
                        }} onKeyDown={(evt) => {
                            if (evt.keyCode === 13) {
                                setListOpen(false)
                                setSearchTerm(color)
                                onAction()
                            }

                            // on key down event closes list if escape key (keycode 27) is pressed 
                            if (evt.keyCode === 27) {
                                setListOpen(false)
                            }

                            // displays list item with what user has entered bolded and the remaining letters (substring) unbolded
                        }} key={index} tabIndex={0}> <b>{searchTerm}</b>{color.substring(searchTerm.length, color.length)}</p></div>
                    ))} </div>


                )}
                {/* </div> */}
            </div>



        </div>

    )

}



export default Typeahead
