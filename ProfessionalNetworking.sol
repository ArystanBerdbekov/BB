pragma solidity ^0.8.0;

contract ProfessionalNetworking {
    struct User {
        string name;
        string bio;
        string profilePic;
        address[] friends;
        address[] friendRequestsSent;
        address[] friendRequestsReceived;
        string[] posts;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed user, string name, string bio, string profilePic);
    event FriendRequestSent(address indexed sender, address indexed receiver);
    event FriendRequestAccepted(address indexed sender, address indexed receiver);
    event PostCreated(address indexed author, string content);

    function registerUser(string memory _name, string memory _bio, string memory _profilePic) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_bio).length > 0, "Bio is required");
        require(bytes(_profilePic).length > 0, "Profile picture URL is required");

        users[msg.sender].name = _name;
        users[msg.sender].bio = _bio;
        users[msg.sender].profilePic = _profilePic;

        emit UserRegistered(msg.sender, _name, _bio, _profilePic);
    }

    function sendFriendRequest(address _receiver) public {
        require(msg.sender != _receiver, "Cannot send friend request to yourself");
        require(bytes(users[_receiver].name).length > 0, "Receiver does not exist");

        users[_receiver].friendRequestsReceived.push(msg.sender);
        users[msg.sender].friendRequestsSent.push(_receiver);

        emit FriendRequestSent(msg.sender, _receiver);
    }

    function acceptFriendRequest(address _sender) public {
        require(msg.sender != _sender, "Cannot accept friend request from yourself");
        require(users[_sender].friendRequestsSent.length > 0, "No friend request from this user");
        require(users[_sender].friendRequestsSent[0] == msg.sender, "Invalid friend request");

        users[msg.sender].friends.push(_sender);
        users[_sender].friends.push(msg.sender);

        delete users[msg.sender].friendRequestsSent[0];
        delete users[_sender].friendRequestsReceived[msg.sender];

        emit FriendRequestAccepted(msg.sender, _sender);
    }

    function createPost(string memory _content) public {
        users[msg.sender].posts.push(_content);
        emit PostCreated(msg.sender, _content);
    }

    function getFriendRequests(address _user) public view returns (address[] memory) {
        return users[_user].friendRequestsReceived;
    }

    function getProfileInfo(address _user) public view returns (string memory, string memory, string memory) {
        return (users[_user].name, users[_user].bio, users[_user].profilePic);
    }

    function getUserPosts(address _user) public view returns (string[] memory) {
        return users[_user].posts;
    }
}
