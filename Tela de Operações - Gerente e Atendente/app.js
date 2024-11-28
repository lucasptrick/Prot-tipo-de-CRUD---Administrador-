// Seletores de elementos do DOM
const form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    userName = document.getElementById("name"),
    age = document.getElementById("age"),
    city = document.getElementById("city"),
    email = document.getElementById("email"),
    phone = document.getElementById("phone"),
    // post = document.getElementById("post"),
    sDate = document.getElementById("sDate"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser"),
    searchUserBtn = document.querySelector(".searchUser"),
    deleteModal = document.getElementById("deleteModal"),
    confirmDeleteBtn = document.getElementById("confirmDelete"),
    cancelDeleteBtn = document.getElementById("cancelDelete");

let getData = localStorage.getItem('userProfile') 
    ? JSON.parse(localStorage.getItem('userProfile')) 
    : [];

let isEdit = false, editId;

// Exibe os dados existentes ao carregar a página
showInfo();

// Botão "Novo Usuário"
newUserBtn.addEventListener('click', () => {
    resetForm();
    submitBtn.innerText = 'Enviar';
    modalTitle.innerText = "Preencha o Formulário";
    isEdit = false;
});

// Manipula upload de imagens
file.onchange = function () {
    if (file.files[0].size < 1000000) { // Limite de 1MB
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            imgInput.src = e.target.result;
        };

        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("Este arquivo é muito grande! (máx. 1MB)");
    }
};

// Exibe informações na tabela
function showInfo() {
    userInfo.innerHTML = ''; // Limpa a tabela
    getData.forEach((element, index) => {
        const row = `
            <tr class="employeeDetails">
                <td>${index + 1}</td>
                <td><img src="${element.picture}" alt="" width="50" height="50"></td>
                <td>${element.employeeName}</td>
                <td>${element.employeeAge}</td>
                <td>${element.employeeCity}</td>
                <td>${element.employeeEmail}</td>
                <td>${element.employeePhone}</td>
                <td>${element.employeePost}</td>
                <td>${element.startDate}</td>
                <td>
                    <button class="btn btn-success" 
                        onclick="readInfo('${element.picture}', '${element.employeeName}', '${element.employeeAge}', '${element.employeeCity}', '${element.employeeEmail}', '${element.employeePhone}', '${element.employeePost}', '${element.startDate}')" 
                        data-bs-toggle="modal" data-bs-target="#readData">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-primary" 
                        onclick="editInfo(${index}, '${element.picture}', '${element.employeeName}', '${element.employeeAge}', '${element.employeeCity}', '${element.employeeEmail}', '${element.employeePhone}', '${element.employeePost}', '${element.startDate}')" 
                        data-bs-toggle="modal" data-bs-target="#userForm">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger" onclick="confirmDelete(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
        userInfo.innerHTML += row;
    });
}

// Exibe informações do usuário no modal de leitura
function readInfo(pic, name, age, city, email, phone, post, sDate) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = name;
    document.querySelector("#showAge").value = age;
    document.querySelector("#showCity").value = city;
    document.querySelector("#showEmail").value = email;
    document.querySelector("#showPhone").value = phone;
    // document.querySelector("#showPost").value = post;
    document.querySelector("#showsDate").value = sDate;
}

// Edita informações do usuário
function editInfo(index, pic, name, Age, City, Email, Phone, Sdate) {
    isEdit = true;
    editId = index;

    imgInput.src = pic;
    userName.value = name;
    age.value = Age;
    city.value = City;
    email.value = Email;
    phone.value = Phone;
    // post.value = Post;
    sDate.value = Sdate;

    submitBtn.innerText = "Atualizar";
    modalTitle.innerText = "Atualizar Perfil";
}

// Função para pegar um usuário
// Botão "Pesquisar Usuário"
searchUserBtn.addEventListener('click', () => {
    // Limpa o campo de pesquisa ao abrir o modal
    document.getElementById('searchEmail').value = '';
});

// Função para pesquisar o usuário pelo e-mail
document.querySelector('.searchConfirm').addEventListener('click', () => {
    const searchEmail = document.getElementById('searchEmail').value.trim();
    if (searchEmail === '') {
        alert('Por favor, insira um e-mail válido!');
        return;
    }

    const user = getData.find(user => user.employeeEmail === searchEmail);
    if (user) {
        // Exibe as informações do usuário no console ou em um alerta
        alert(`Usuário encontrado: \n
            Nome: ${user.employeeName}\n
            Idade: ${user.employeeAge}\n
            Cidade: ${user.employeeCity}\n
            Telefone: ${user.employeePhone}\n
            Cargo: ${user.employeePost}\n
            Data de Início: ${user.startDate}`);
    } else {
        alert('Usuário não encontrado.');
    }
});



// Função para abrir o modal de exclusão
function confirmDelete(index) {
    deleteModal.classList.add("show"); // Exibe o modal

    // Define ações para os botões "Sim" e "Não"
    confirmDeleteBtn.onclick = function () {
        getData.splice(index, 1); // Remove o item da lista
        localStorage.setItem("userProfile", JSON.stringify(getData)); // Atualiza o localStorage
        showInfo(); // Atualiza a tabela
        closeDeleteModal(); // Fecha o modal
    };

    cancelDeleteBtn.onclick = closeDeleteModal; // Fecha o modal ao clicar em "Não"

    // Fecha o modal ao clicar fora dele
    window.onclick = function (event) {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    };
}

// Função para fechar o modal
function closeDeleteModal() {
    deleteModal.classList.remove("show"); // Remove a classe 'show' para esconder o modal
}

// Garante que o modal esteja escondido ao carregar a página
window.onload = function () {
    deleteModal.classList.remove("show");
};



// Manipula envio do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        picture: imgInput.src || "./image/Profile Icon.webp",
        employeeName: userName.value,
        employeeAge: age.value,
        employeeCity: city.value,
        employeeEmail: email.value,
        // employeePhone: phone.value,
        employeePost: post.value,
        startDate: sDate.value
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        getData[editId] = information;
        isEdit = false;
    }

    localStorage.setItem('userProfile', JSON.stringify(getData));
    showInfo();
    resetForm();
});

// Reseta o formulário para o estado inicial
function resetForm() {
    form.reset();
    imgInput.src = "./image/Profile Icon.webp";
    submitBtn.innerText = "Enviar";
    modalTitle.innerText = "Preencha o Formulário";
}
