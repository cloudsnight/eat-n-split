import React, { useState } from "react";
import initialFriends from "./Data";

function App() {
  const [isAdd, setIsAdd] = useState(false);
  const [isSelect, setIsSelect] = useState(null);
  const [allFriends, setAllFriends] = useState(initialFriends);

  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoIsPay, setWhoIsPay] = useState("user");

  const friendExpense = bill - yourExpense;
  const balanceExpense = (friendExpense + (-yourExpense)) === 0;

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList dataObj={{ isSelect, setIsSelect, isAdd, setIsAdd, allFriends, balanceExpense }} />
        {!isAdd ? null : <FormAddFriend dataObj={{ allFriends, setAllFriends }} />}
        <Button onclick={() => handleButton({ isAdd, setIsAdd, setIsSelect })}>{!isAdd ? "Add Friend" : "❌ Close"}</Button>
      </div>
      {isSelect ? <FormSplitBill dataObj={{ isSelect, setIsSelect, allFriends, setAllFriends, bill, setBill, yourExpense, setYourExpense, whoIsPay, setWhoIsPay, friendExpense }} /> : null}
    </div>
  );
}

function handleButton({ isAdd, setIsAdd, setIsSelect }) {
  setIsAdd(!isAdd);
  setIsSelect(false);
}

function FriendsList({ dataObj }) {
  return (
    <ul>
      {dataObj.allFriends.map(friend => (<Friend dataObj={dataObj} key={friend.id} friend={friend} />))}
    </ul>
  );
}

function Friend({ friend, dataObj }) {
  const isSameId = friend.id === dataObj.isSelect;

  function handleSelect() {
    dataObj.setIsSelect(isSameId ? null : friend.id);
    dataObj.setIsAdd(false);
  }

  return (
    <li style={isSameId ? { backgroundColor: "#fff4e6" } : {}}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You Owe {friend.name} ${Math.abs(friend.balance)}</p>}
      {friend.balance > 0 && <p className="green">{friend.name} Owe You ${friend.balance}</p>}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onclick={handleSelect}>{isSameId ? "Close" : "Select"}</Button>
    </li>
  );
}

function Button({ children, onclick }) {
  return <button onClick={onclick} className="button">{children}</button>
}

function FormAddFriend({ dataObj }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();

  const newFriend = { id: crypto.randomUUID(), name, image: image + "?u=" + id, balance: Math.floor((Math.random() * 100) + 1) };

  function handleSubmit(e) {
    e.preventDefault();
    dataObj.setAllFriends((friends) => [...friends, newFriend]);
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏼‍🤝‍👩🏼 Friend Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🎴 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Save</Button>
    </form>
  );
}

function FormSplitBill({ dataObj }) {
  const idSelect = dataObj.isSelect;
  const filterName = dataObj.allFriends.filter(d => idSelect === d.id).map(d => d.name);

  function handleSubmit(event, idSelect) {
    event.preventDefault();
    if (!dataObj.bill || !dataObj.yourExpense) return;

    let zeroMode;

    if (dataObj.whoIsPay === "user") {
      if (dataObj.friendExpense === Math.abs(dataObj.yourExpense)) {
        zeroMode = Number(0);
      } else {
        zeroMode = Number(dataObj.friendExpense);
      }
    } else {
      if (dataObj.friendExpense === Math.abs(dataObj.yourExpense)) {
        zeroMode = Number(0);
      } else {
        zeroMode = Number(-dataObj.yourExpense);
      }
    }

    // console.log(zeroMode);

    dataObj.setAllFriends((friend) => friend.map(m => m.id === idSelect ? { ...m, balance: zeroMode } : m));
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e, idSelect)}>
      <h2>SPLIT A BILL WITH {filterName}</h2>
      <label>💰 Bill value</label>
      <input type="number" value={dataObj.bill} onChange={(e) => dataObj.setBill(Number(e.target.value))} />
      <label>🧍‍♂️ Your expense</label>
      <input type="number" value={dataObj.yourExpense} onChange={(event) => handleYourExpense(event, { dataObj })} />
      <label>👨🏼‍🤝‍👨🏼 {filterName} expense</label>
      <input type="number" value={dataObj.friendExpense} disabled />
      <label>🤑 Who is paying the bill ?</label>
      <select value={dataObj.whoIsPay} onChange={(e) => dataObj.setWhoIsPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{filterName}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function handleYourExpense(event, { dataObj }) {
  dataObj.setYourExpense(Number(event.target.value) > dataObj.bill ? dataObj.yourExpense : Number(event.target.value));
}

export default App;
