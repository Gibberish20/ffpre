//SPDX-License-Identifier: MIT
// File: contracts/lib/interfaces/IERC165.sol


// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
  /**
   * @dev Returns true if this contract implements the interface defined by
   * `interfaceId`. See the corresponding
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
   * to learn more about how these ids are created.
   *
   * This function call must use less than 30 000 gas.
   */
  function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: contracts/interfaces/IERC404.sol


pragma solidity ^0.8.20;


interface IERC404 is IERC165 {
  event ERC20Approval(address owner, address spender, uint256 value);
  event ApprovalForAll(
    address indexed owner,
    address indexed operator,
    bool approved
  );
  event ERC721Approval(
    address indexed owner,
    address indexed spender,
    uint256 indexed id
  );
  event ERC20Transfer(address indexed from, address indexed to, uint256 amount);
  event ERC721Transfer(
    address indexed from,
    address indexed to,
    uint256 indexed id
  );

  error NotFound();
  error InvalidId();
  error AlreadyExists();
  error InvalidRecipient();
  error InvalidSender();
  error InvalidSpender();
  error InvalidOperator();
  error UnsafeRecipient();
  error RecipientIsERC721TransferExempt();
  error SenderIsERC721TransferExempt();
  error Unauthorized();
  error InsufficientAllowance();
  error DecimalsTooLow();
  error CannotRemoveFromERC721TransferExempt();
  error PermitDeadlineExpired();
  error InvalidSigner();
  error InvalidApproval();
  error OwnedIndexOverflow();

  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
  function totalSupply() external view returns (uint256);
  function erc20TotalSupply() external view returns (uint256);
  function erc721TotalSupply() external view returns (uint256);
  function balanceOf(address owner_) external view returns (uint256);
  function erc721BalanceOf(address owner_) external view returns (uint256);
  function erc20BalanceOf(address owner_) external view returns (uint256);
  function erc721TransferExempt(address account_) external view returns (bool);
  function isApprovedForAll(
    address owner_,
    address operator_
  ) external view returns (bool);
  function allowance(
    address owner_,
    address spender_
  ) external view returns (uint256);
  function owned(address owner_) external view returns (uint256[] memory);
  function ownerOf(uint256 id_) external view returns (address erc721Owner);
  function tokenURI(uint256 id_) external view returns (string memory);
  function approve(
    address spender_,
    uint256 valueOrId_
  ) external returns (bool);
  function setApprovalForAll(address operator_, bool approved_) external;
  function transferFrom(
    address from_,
    address to_,
    uint256 valueOrId_
  ) external returns (bool);
  function transfer(address to_, uint256 amount_) external returns (bool);
  function erc721TokensBankedInQueue() external view returns (uint256);
  function safeTransferFrom(address from_, address to_, uint256 id_) external;
  function safeTransferFrom(
    address from_,
    address to_,
    uint256 id_,
    bytes calldata data_
  ) external;
  function setERC721TransferExempt(address account_, bool value_) external;
  function DOMAIN_SEPARATOR() external view returns (bytes32);
  function permit(
    address owner_,
    address spender_,
    uint256 value_,
    uint256 deadline_,
    uint8 v_,
    bytes32 r_,
    bytes32 s_
  ) external;
}

// File: @openzeppelin/contracts/utils/cryptography/MerkleProof.sol


// OpenZeppelin Contracts (last updated v5.0.0) (utils/cryptography/MerkleProof.sol)

pragma solidity ^0.8.20;

/**
 * @dev These functions deal with verification of Merkle Tree proofs.
 *
 * The tree and the proofs can be generated using our
 * https://github.com/OpenZeppelin/merkle-tree[JavaScript library].
 * You will find a quickstart guide in the readme.
 *
 * WARNING: You should avoid using leaf values that are 64 bytes long prior to
 * hashing, or use a hash function other than keccak256 for hashing leaves.
 * This is because the concatenation of a sorted pair of internal nodes in
 * the Merkle tree could be reinterpreted as a leaf value.
 * OpenZeppelin's JavaScript library generates Merkle trees that are safe
 * against this attack out of the box.
 */
library MerkleProof {
    /**
     *@dev The multiproof provided is not valid.
     */
    error MerkleProofInvalidMultiproof();

    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    /**
     * @dev Calldata version of {verify}
     */
    function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProofCalldata(proof, leaf) == root;
    }

    /**
     * @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
     * from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
     * hash matches the root of the tree. When processing the proof, the pairs
     * of leafs & pre-images are assumed to be sorted.
     */
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Calldata version of {processProof}
     */
    function processProofCalldata(bytes32[] calldata proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Returns true if the `leaves` can be simultaneously proven to be a part of a Merkle tree defined by
     * `root`, according to `proof` and `proofFlags` as described in {processMultiProof}.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function multiProofVerify(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProof(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Calldata version of {multiProofVerify}
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function multiProofVerifyCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProofCalldata(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Returns the root of a tree reconstructed from `leaves` and sibling nodes in `proof`. The reconstruction
     * proceeds by incrementally reconstructing all inner nodes by combining a leaf/inner node with either another
     * leaf/inner node or a proof sibling node, depending on whether each `proofFlags` item is true or false
     * respectively.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. To use multiproofs, it is sufficient to ensure that: 1) the tree
     * is complete (but not necessarily perfect), 2) the leaves to be proven are in the opposite order they are in the
     * tree (i.e., as seen from right to left starting at the deepest layer and continuing at the next layer).
     */
    function processMultiProof(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the Merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        if (leavesLen + proofLen != totalHashes + 1) {
            revert MerkleProofInvalidMultiproof();
        }

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            if (proofPos != proofLen) {
                revert MerkleProofInvalidMultiproof();
            }
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Calldata version of {processMultiProof}.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function processMultiProofCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the Merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        if (leavesLen + proofLen != totalHashes + 1) {
            revert MerkleProofInvalidMultiproof();
        }

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            if (proofPos != proofLen) {
                revert MerkleProofInvalidMultiproof();
            }
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Sorts the pair (a, b) and hashes the result.
     */
    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    /**
     * @dev Implementation of keccak256(abi.encode(a, b)) that doesn't allocate or expand memory.
     */
    function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}

// File: contracts/examples/e1/presale.sol


pragma solidity ^0.8.0;





contract FruityPresale  {
  uint256 public publicPrice;
  uint256 public privatePrice;
  uint256 public publicMaxDeposit;
  uint256 public privateMaxDeposit;

  uint256 public publicRaised;
  uint256 public privateRaised;
  uint256 public raised = publicRaised + privateRaised;

  address public owner;
  address public token;

  bytes32 private merkleRoot;

  bool public presaleIsOpen;
  bool public claimOpen;
  bool private initiated = false;
  bool private locked;

  mapping(address => uint256) public alloc;
  mapping(address => uint256) public deposit;
  mapping(address => bool) public whitelist;

  event PresaleInitiated(
    uint256 publicPrice,
    uint256 privatePrice,
    uint256 publicMaxDeposit,
    uint256 privateMaxDeposit
  );
  event Deposited(address indexed user, uint256 amount, bool isPrivate);
  event ClaimOpened();
  event PresaleOpened();
  event PresaleClosed();
  event Claimed(address indexed user, uint256 amount);

  constructor(address _token) {
    owner = msg.sender;
    token = _token;
  }

  function init(
    uint256 _publicPrice,
    uint256 _privatePrice,
    uint256 _publicMaxDeposit,
    uint256 _privateMaxDeposit,
    bytes32 _merkleRoot
  ) external onlyOwner {
    publicPrice = _publicPrice;
    privatePrice = _privatePrice;
    publicMaxDeposit = _publicMaxDeposit;
    privateMaxDeposit = _privateMaxDeposit;
    merkleRoot = _merkleRoot;

    initiated = true;
    emit PresaleInitiated(
      publicPrice,
      privatePrice,
      publicMaxDeposit,
      privateMaxDeposit
    );
  }

  function depositPublic() external  noReentrancy {
    require(initiated == true, "Wait till contract is initialized");
    require(msg.value > 0, "Wrong value");
    require(presaleIsOpen == true, "Presale is closed");
    require(
      deposit[msg.sender] + msg.value <= publicMaxDeposit,
      "Max deposit reached"
    );

    deposit[msg.sender] += msg.value;

    // Update Alloc
    uint256 tokenAmt = (msg.value * 100) / publicPrice;
    alloc[msg.sender] += tokenAmt;

    publicRaised += msg.value;
    emit Deposited(msg.sender, msg.value, false);
  }

  function depositPrivate(
    bytes32[] calldata _merkleProof
  ) external payable noReentrancy {
    require(initiated == true, "Wait till contract is initialized");
    require(presaleIsOpen == true, "Presale is closed");
    require(
      isWhitelisted(_merkleProof, msg.sender) == true,
      "Not on Whitelist"
    );
    require(msg.value > 0, "Wrong value");
    require(
      deposit[msg.sender] + msg.value <= privateMaxDeposit,
      "Max alloc reached"
    );
    deposit[msg.sender] += msg.value;

    // Update Alloc
    uint256 tokenAmt = (msg.value * 100) / privatePrice;
    alloc[msg.sender] += tokenAmt;

    privateRaised += msg.value;
    emit Deposited(msg.sender, msg.value, true);
  }

  function claim() external noReentrancy {
    require(claimOpen == true, "Claim not allowed");
    require(alloc[msg.sender] > 0, "Nothing to withdraw");
    uint256 amount = alloc[msg.sender];
    alloc[msg.sender] = 0;
    IERC404(token).transfer(msg.sender, amount);
    emit Claimed(msg.sender, amount);
  }

  function openClaim() external onlyOwner {
    require(presaleIsOpen == false, "Presale is open");
    claimOpen = true;
    emit ClaimOpened();
  }

  function closeClaim() external onlyOwner {
    require(presaleIsOpen == false, "Presale is open");
    claimOpen = false;
    emit ClaimOpened();
  }

  function openPresale() external onlyOwner {
    presaleIsOpen = true;
    emit PresaleOpened();
  }

  function closePresale() external onlyOwner {
    presaleIsOpen = false;
    emit PresaleClosed();
  }

  function setTokenAddress(address _address) external onlyOwner {
    token = _address;
  }

  function setOwner(address _address) external onlyOwner {
    require(_address != address(0), "Zero address");
    owner = _address;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Caller is not owner");
    _;
  }

  modifier noReentrancy() {
    require(!locked, "No re-entrancy");
    locked = true;
    _;
    locked = false;
  }

  function SetMerkleRoot(bytes32 _MerkleRoot) external onlyOwner {
    merkleRoot = _MerkleRoot;
  }

  function isWhitelisted(
    bytes32[] calldata _merkleProof,
    address _participant
  ) public view returns (bool) {
    bytes32 leaf = keccak256(abi.encodePacked(_participant));
    return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
  }

  function withdraw(address account) external onlyOwner {
    require(presaleIsOpen == false, "Presale is open");
    payable(address(account)).transfer(address(this).balance);
  }

  receive() external payable {}
}
