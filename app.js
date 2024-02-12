
let web3;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return true;
    } else {
        alert('Please install MetaMask to use this dApp.');
        return false;
    }
}

const contractABI = [

];

const contractAddress = 'CONTRACT_ADDRESS';


const contract = new web3.eth.Contract(contractABI, contractAddress);


async function registerUser(name, bio, profilePic) {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.registerUser(name, bio, profilePic).send({ from: accounts[0] });
        alert('Registration successful!');
        window.location.href = 'main.html'; 
    } catch (error) {
        console.error(error);
        alert('Failed to register user. Please try again.');
    }
}

async function loadUserInfo() {
    try {
        const accounts = await web3.eth.getAccounts();
        const userInfo = await contract.methods.getUserInfo(accounts[0]).call();
        document.getElementById('userInfo').innerHTML = `<p>Name: ${userInfo.name}</p><p>Bio: ${userInfo.bio}</p><img src="${userInfo.profilePic}" alt="Profile Picture">`;
        const friendRequests = await contract.methods.getFriendRequests(accounts[0]).call();
        document.getElementById('friendRequests').innerHTML = `<p>Friend Requests: ${friendRequests.length}</p>`;
        const userPosts = await contract.methods.getUserPosts(accounts[0]).call();
        document.getElementById('userPosts').innerHTML = `<h2>Posts</h2><ul>${userPosts.map(post => `<li>${post}</li>`).join('')}</ul>`;
    } catch (error) {
        console.error(error);
        alert('Failed to load user information.');
    }
}

async function loadProfileInfo() {
    try {
        const accounts = await web3.eth.getAccounts();
        const profileInfo = await contract.methods.getProfileInfo(accounts[0]).call();
        document.getElementById('profileInfo').innerHTML = `<p>Name: ${profileInfo.name}</p><p>Bio: ${profileInfo.bio}</p><img src="${profileInfo.profilePic}" alt="Profile Picture">`;
        const userPosts = await contract.methods.getUserPosts(accounts[0]).call();
        document.getElementById('userPosts').innerHTML = `<h2>Posts</h2><ul>${userPosts.map(post => `<li>${post}</li>`).join('')}</ul>`;
    } catch (error) {
        console.error(error);
        alert('Failed to load user profile information.');
    }
}

document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    const isConnected = await connectWallet();
    if (isConnected) {
        window.location.href = 'registration.html';
    }
});

document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const bio = document.getElementById('bioInput').value;
    const profilePic = document.getElementById('profilePicInput').value;
    if (name && bio && profilePic) {
        await registerUser(name, bio, profilePic);
    } else {
        alert('Please fill in all fields.');
    }
});

if (window.location.pathname === '/main.html') {
    loadUserInfo();
}

if (window.location.pathname === '/user-profile.html') {
    loadProfileInfo();
}
