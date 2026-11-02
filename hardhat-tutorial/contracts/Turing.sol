//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is the main building block for smart contracts.
contract Turing is ERC20 {

    address public owner;

    // ATIVIDADE 12
    mapping(string => address) public users;

    // infelizmente foi necessario criar esse array para verificar o msg.sender no vote
    string[] public codinomes = [
        "roberta", "nome1", "nome2", "nome3", "nome4",
        "nome5", "nome6", "nome7", "nome8", "nome9",
        "nome10", "nome11", "nome12", "nome13", "nome14",
        "nome15", "nome16", "nome17", "nome18", "nome19"
    ];

    mapping(address => mapping(address => bool)) public hasVote;
    mapping(address => uint256) public acessos;

    bool voting = true;

    modifier verificaAcesso(){
        require(msg.sender == users['roberta'] || msg.sender == owner, "voce nao pode chamar esse metodo");
        _;
    }

    constructor() ERC20("Turing", "Tur"){

        owner = msg.sender;

        users['roberta'] = 0x502542668aF09fa7aea52174b9965A7799343Df7;
        users['nome1'] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        users['nome2'] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        users['nome3'] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        users['nome4'] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        users['nome5'] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        users['nome6'] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        users['nome7'] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        users['nome8'] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        users['nome9'] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        users['nome10'] = 0xBcd4042DE499D14e55001CcbB24a551F3b954096;
        users['nome11'] = 0x71bE63f3384f5fb98995898A86B02Fb2426c5788;
        users['nome12'] = 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a;
        users['nome13'] = 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec;
        users['nome14'] = 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097;
        users['nome15'] = 0xcd3B766CCDd6AE721141F452C550Ca635964ce71;
        users['nome16'] = 0x2546BcD3c84621e976D8185a91A922aE77ECEc30;
        users['nome17'] = 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E;
        users['nome18'] = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;
        users['nome19'] = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199;

    }

    function updateUser(string memory codinome, address user_addr) public verificaAcesso(){
        require(bytes(codinome).length > 0, "codinome vazio");
        users[codinome] = user_addr;
        voting = true;
    }

    function votingOn() public verificaAcesso(){
        voting = true;
    }

    function votingOff() public verificaAcesso(){
        voting = false;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function issueToken(string memory codinome , uint256 qtde_de_Turings) public verificaAcesso(){
        _mint(users[codinome], qtde_de_Turings * (10 ** uint256(decimals())));
    }

    function vote(string memory codinome, uint256 qtde_de_Turings) public {
        require(voting == true, "A votacao nao esta ativa");

        //verifica se o msg.sender esta cadastrado
        bool autorizado = (msg.sender == owner);
        for (uint256 i = 0; i < codinomes.length; i++) {
            if (users[codinomes[i]] == msg.sender) {
                autorizado = true;
                break;
            }
        }

        require(autorizado, "Pessoa nao autorizada");
        require(users[codinome] != address(0), "Destinatario nao encontrado");
        require(users[codinome] != msg.sender, "Voce nao pode votar em voce mesmo");
        require(qtde_de_Turings > 0 && qtde_de_Turings <= 2, "Quantidade de turings invalidas");
        require(hasVote[msg.sender][users[codinome]] == false, "Voce ja votou nesse cara");

        _mint(users[codinome], qtde_de_Turings * (10 ** uint256(decimals())));
        hasVote[msg.sender][users[codinome]] = true;
        acessos[msg.sender]++;
        if(acessos[msg.sender] == 10){
            _mint(msg.sender, 1 * (10 ** uint256(decimals())));
            acessos[msg.sender] = 0;
        }

    }

}