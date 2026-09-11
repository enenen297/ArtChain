document.addEventListener('DOMContentLoaded', () => {
    checkWalletConnection();

    document.addEventListener('click', (event) => {
        const connectBtn = event.target.closest('#connectBtn');
        if (connectBtn) {
            connectWallet();
        }
    });

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
});


async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask chưa được cài đặt! Vui lòng cài đặt tiện ích MetaMask trên trình duyệt của bạn.');
        window.open('https://metamask.io/download/', '_blank');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        if (accounts.length > 0) {
            handleAccountsChanged(accounts);
        }
    } catch (error) {
        if (error.code === 4001) {
            console.log('Người dùng đã từ chối yêu cầu kết nối.');
        } else {
            console.error('Lỗi kết nối MetaMask:', error);
            alert('Có lỗi xảy ra khi kết nối MetaMask!');
        }
    }
}

async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            if (accounts.length > 0) {
                handleAccountsChanged(accounts);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái ví:', error);
        }
    }
}

function handleAccountsChanged(accounts) {
    const connectBtnText = document.getElementById('connectBtnText');
    const walletAddressBox = document.getElementById('walletAddressBox');
    const walletAddressText = document.getElementById('walletAddress');

    if (accounts.length === 0) {
        if (connectBtnText) connectBtnText.innerText = 'Connect MetaMask';
        if (walletAddressBox) walletAddressBox.classList.add('hidden');
    } else {
        const account = accounts[0];
        const truncatedAddress = truncateAddress(account);

        // Update nút bấm trên Navbar
        if (connectBtnText) {
            connectBtnText.innerText = truncatedAddress;
        }

        if (walletAddressBox && walletAddressText) {
            walletAddressText.innerText = truncatedAddress;
            walletAddressBox.classList.remove('hidden');
        }
    }
}

function truncateAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}