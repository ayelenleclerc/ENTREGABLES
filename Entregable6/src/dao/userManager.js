import { createHash, isValidPassword } from "../utils.js";
import userModel from "./models/userModel.js";

class userMananger {
  constructor() {}

  async getUserById(id) {
    // llamo la funcion para obtener los productos y buscar por id

    const usuarioBuscado = await userModel.find({ _id: id });
    if ((await productoBuscado) != undefined) {
      return await productoBuscado;
    } else {
      console.log("Not found");
      return false;
    }
  }

  async getUsers(params) {
    let { limit, page, query, sort } = params;
    limit = limit ? limit : 10;
    page = page ? page : 1;
    // para poder convertir en un objeto el query lo que hago es generar un array del par clave valor y luego lo convierto con la propiedad de OBject. uso una expresion regular en el replace para que le elimine todas las comillas de coca cola
    let clave = query ? query.split(":")[0] : "";
    let valor = query ? query.split(":")[1].replace(/(")/gm, "") : "";
    let arrayQuery = [clave, valor];
    let ObjQuery = Object.fromEntries([arrayQuery]);
    query = query ? ObjQuery : {};
    sort = sort ? (sort == "asc" ? 1 : -1) : 0;
    let listaUsuarios = [];
    let filtro = {};

    if (sort == 0) {
      filtro = { limit: limit, page: page };
    } else {
      filtro = { limit: limit, page: page, sort: { price: sort } };
    }

    try {
      listaUsuarios = await userModel.paginate(query, filtro);
      let status = listaUsuarios ? "success" : "error";
      let hasPrevPage = listaUsuarios.hasPrevPage;
      let hasNextPage = listaUsuarios.hasNextPage;
      let prevPage = listaUsuarios.prevPage;
      let nextPage = listaUsuarios.nextPage;
      let prevLink =
        hasPrevPage != false
          ? "http://localhost:8080/users/?limit=" + limit + "&page=" + prevPage
          : null;
      let nextLink =
        hasNextPage != false
          ? "http://localhost:8080/users/?limit=" + limit + "&page=" + nextPage
          : null;

      listaUsuarios = {
        status: status,
        payLoad: listaUsuarios.docs,
        totalPages: listaUsuarios.totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: listaUsuarios.page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };
    } catch (err) {
      console.log("fallo la consulta" + err);
    }
    return listaUsuarios;
  }

  async addUser(first_name, last_name, email, age, password, admin) {
    //creo un objeto nuevo con atributos nuevos
    let user1 = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      age: age,
      password: createHash(password),
      admin: admin,
    };
    //creo un array con los valores de ese nuevo objeto
    let valores = [
      user1.first_name,
      user1.last_name,
      user1.email,
      user1.age,
      user1.password,
      user1.admin,
    ];
    //corroboro que no haya ningun valor vacio dentro de ese array
    let elementoVacio = valores.includes("");
    //corroboro que no haya ningun valor undefined dentro de ese array
    let elementoUnd = valores.includes(undefined);

    //valido si existe la coleccion.
    const listaUser = async () => {
      let listaUsuarios = [];
      try {
        listaUsuarios = await userModel.find().lean();
      } catch (err) {
        console.log("fallo la consulta o no existe la coleccion " + err);
      }
      return listaUsuarios;
    };

    // con map genero un array de los email y veo si existe el mismo valor
    let ListaEmail = listaUser().then((resultado) =>
      resultado.map((elemento) => elemento.email)
    );
    let mismoemail = ListaEmail.then((resultado) =>
      resultado.includes(user1.email)
    );
    if (elementoVacio || elementoUnd) {
      console.log("existen atributos sin un valor definido");
      return "valorVacio";
    } else if (await mismoemail) {
      console.log("El email ingresado ya se encuentra registrado, elija otro");
      return "emailRepetido";
    } else {
      await userModel.create(user1);
      return true;
    }
  }

  async login(user, pass) {
    const userLogin = (await userModel.findOne({ email: user }).lean()) || null;

    if ((await userLogin) == null) {
      return "invalidUser";
    }

    if (!isValidPassword(userLogin, pass)) {
      return "invalidPassword";
    }

    return userLogin;
  }

  // restore password
  async restore(user, pass) {
    const userRestore =
      (await userModel.findOne({ email: user }).lean()) || null;

    if ((await userRestore) == null) {
      return "invalidUser";
    }
    const newPass = createHash(pass);

    userRestore.password = newPass;

    await userModel.updateOne({ email: user }, userRestore);

    return userRestore;
  }
}

export default userMananger;
