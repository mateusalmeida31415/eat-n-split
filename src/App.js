import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(name, image) {
    if (name && image) {
      const id = crypto.randomUUID();
      const friend = {
        id,
        name,
        image: `${image}?=${id}`,
        balance: 0,
      };
      setFriends((f) => [...friends, friend]);
      setShowAddFriend((show) => !show);
    }
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleUpdate(myFriend, value) {
    setFriends(
      friends.map((friend) => {
        if (friend.id === myFriend.id) {
          return { ...friend, balance: value };
        }
        return friend;
      })
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend ? <FormAddFriend onAddfriend={handleAddFriend} /> : ""}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onBalance={handleUpdate} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            onSelectedFriend={onSelectedFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={() => {
          onSelectedFriend(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddfriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSumit(e) {
    e.preventDefault();
    onAddfriend(name, image);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend">
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🏝️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button onClick={handleSumit}>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onBalance }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpence] = useState("");
  const friendExpense = bill ? bill - myExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !friendExpense) return;

    let value = 0;

    if (whoIsPaying === "user") {
      value = friend.balance + myExpense - friendExpense;
    } else {
      value = friend.balance + myExpense + friendExpense;
    }
    onBalance(friend, value);
  }

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {friend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label> 🧍‍♂️Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpence(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {friend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button onClick={(e) => handleSubmit(e)}>Split bill</Button>
    </form>
  );
}
export default App;
