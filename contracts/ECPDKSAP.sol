// SPDX-License-Identifier: UNLICENSED
pragma solidity  >=0.8.0 <0.9.0;

contract ECPDKSAP {
    uint256 public constant ECPDKSAP_SCHEME_ID = 3327;
    string constant META_ID_ALREADY_REGISTERED = "ERR: Meta ID is already registered!";
    string constant META_ID_IS_NOT_REGISTERED = "ERR: Meta ID has not been registered!";

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    event Announcement(
        uint256 indexed schemeId,
        address indexed stealthAddress,
        address indexed caller,
        bytes ephemeralPubKey,
        bytes metadata
    );

    event MetaAddressRegistered(string indexed id, bytes indexed metaAddress);

    mapping(bytes32 => bytes) public s_idToMetaAddress;

    function sendEthViaProxy(
        address payable _stealthAddress,
        bytes memory _R,
        bytes memory _viewTag
    ) external payable {
        _announce(_stealthAddress, _R, _viewTag);
        _stealthAddress.transfer(msg.value);
    }

    function ethSentWithoutProxy(bytes memory _R, bytes memory _viewTag) external {
        _announce(address(0), _R, _viewTag);
    }

    function registerMetaAddress(string memory _id, bytes memory _metaAddress) external payable {
        bytes32 key = keccak256(abi.encode(_id, "string"));
        require(s_idToMetaAddress[key].length == 0, META_ID_ALREADY_REGISTERED);
        s_idToMetaAddress[key] = _metaAddress;
        emit MetaAddressRegistered(_id, _metaAddress);
    }

    function resolve(string memory _id) external view returns (bytes memory) {
        bytes32 key = keccak256(abi.encode(_id, "string"));
        bytes memory metaAddress = s_idToMetaAddress[key];
        require(metaAddress.length != 0, META_ID_IS_NOT_REGISTERED);
        return metaAddress;
    }

    function _announce(address _stealthAddress, bytes memory _R, bytes memory _viewTag) internal {
        emit Announcement(ECPDKSAP_SCHEME_ID, _stealthAddress, msg.sender, _R, _viewTag);
    }
}
