import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const getLocalStorageItems = () => {
  let newItems = localStorage.getItem("newItems");
  if (newItems) {
    return JSON.parse(localStorage.getItem("newItems"));
  } else {
    return [];
  }
};

function App() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [note, setNote] = useState("");
  const [addItems, setAddItems] = useState(getLocalStorageItems);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [toggleSortByDate, setToggleSortByDate] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const remainigEventDays = (date1) => {
    const eventDay = new Date(date1);
    const today = new Date();
    const perDay = 1000 * 60 * 60 * 24;
    const remainDaysInMilliSeconds = eventDay - today;
    let remainingDays = Math.ceil(remainDaysInMilliSeconds / perDay);
    remainingDays = remainingDays < 0 ? null : remainingDays;
    return remainingDays;
  };

  const handleAddItemsForCards = () => {
    const newItems = [
      ...addItems,
      { id: addItems.length + 1, date1: startDate, note: note },
    ];
    setAddItems(newItems);
    handleClose();
    setStartDate(null);
    setNote(null);
  };

  const handleEditInputChange = (e) => {
    setCurrentItem({
      ...currentItem,
      note: e.target.value,
    });
  };
  const handleEditInputChange1 = (e) => {
    setCurrentItem({
      ...currentItem,
      date1: e.target.value,
    });
  };
  const handleEditFormSubmit = () => {
    handleUpdateItem(currentItem.id, currentItem);
  };

  const handleUpdateItem = (id, updatedItem1) => {
    const updatedItem = addItems.map((item) => {
      if (item.id === id) {
        return {
          ...updatedItem1,
        };
      } else {
        return item;
      }
    });
    setIsEditing(false);
    setAddItems([...updatedItem]);
  };

  function handleEditClick(item) {
    setIsEditing(true);
    setCurrentItem({ ...item });
  }

  const handelRemoveItems = (index) => {
    const newItems = [...addItems];
    newItems.splice(index, 1);
    setAddItems(newItems);
  };
  useEffect(() => {
    localStorage.setItem("newItems", JSON.stringify(addItems));
  }, [addItems]);
  return (
    <div className="App">
      <h2 className="mt-4"> Countdown</h2>
      {isEditing ? (
        <Modal show={show1} onHide={handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Countdown</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Control
                style={{ marginBottom: "10px" }}
                type="date"
                name="datepic"
                placeholder="Date"
                value={currentItem.date1}
                minDate={new Date()}
                onChange={handleEditInputChange1}
              />
              <Form.Control
                style={{ marginBottom: "10px" }}
                type="text"
                name="note"
                placeholder="What you want to create countdown for?"
                value={currentItem.note}
                onChange={handleEditInputChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleEditFormSubmit}>
                Update
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      ) : (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Countdown</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              style={{ marginBottom: "10px" }}
              type="date"
              name="datepic"
              placeholder="Date"
              value={startDate}
              minDate={new Date()}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              style={{ marginBottom: "10px" }}
              type="text"
              name="note"
              placeholder="What you want to create countdown for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAddItemsForCards}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
      <div className="container mt-5">
        <div className="row">
          <div className="row">
            <div className="col-8"></div>
            <div className="col-2">
              {addItems?.length ? (
                <Button
                  onClick={() => {
                    addItems.sort(function (a, b) {
                      return toggleSortByDate
                        ? new Date(a.date1) - new Date(b.date1)
                        : new Date(b.date1) - new Date(a.date1);
                    });
                    setToggleSortByDate(!toggleSortByDate);
                    setAddItems([...addItems]);
                  }}
                >
                  Sort by Date
                </Button>
              ) : (
                ""
              )}
              <Button variant="primary" onClick={handleShow} className="m-2">
                Add
              </Button>
            </div>
          </div>
          {addItems?.map((item, index) => {
            if (remainigEventDays(item.date1) === null) {
              return "";
            } else {
              return (
                <div className="card-header card bg-light mb-3 card w-25 m-2">
                  <div className="card-body">
                    <h5 className="card-title">Remaining Days</h5>

                    <div key={index}>
                      <div
                        className="card-text"
                        style={{
                          fontWeight: "600",
                          fontSize: "60px",
                          color: "blue",
                        }}
                      >
                        {remainigEventDays(item?.date1)}
                      </div>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "20px",
                          marginBottom: "15px",
                        }}
                      >
                        {item?.note}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      onClick={() => handelRemoveItems(index)}
                    >
                      Delete
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      className="btn btn-primary"
                      type="submit"
                      onClick={() => {
                        handleShow1();
                        handleEditClick(item);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
