import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: "Login",
      register: "Register",
      username: "Username",
      password: "Password",
      welcome: "Welcome",
      logout: "Logout",
      add_list: "Add List",
      enter_list_name: "Enter list name",
      delete_list: "Delete List",
      manage_members: "Manage Members",
      switch_to_register: "Switch to Register",
      switch_to_login: "Switch to Login",
      light_mode: "Light Mode",
      dark_mode: "Dark Mode",
      languages: "Languages",
      slovak: "Slovak",
      czech: "Czech",
      english: "English",
      add_item: "Add Item",
      add_new_list: "Add New List",
      list_name: "List Name",
      add: "Add",
      invite_member: "Invite Member",
      members: "Members",
      remove: "Remove",
    }
  },
  sk: {
    translation: {
      login: "Prihlásiť",
      register: "Registrácia",
      username: "Používateľské meno",
      password: "Heslo",
      welcome: "Vitaj",
      logout: "Odhlásiť",
      add_list: "Pridať zoznam",
      enter_list_name: "Zadaj názov zoznamu",
      delete_list: "Odstrániť zoznam",
      manage_members: "Spravovať členov",
      switch_to_register: "Prepnúť na registráciu",
      switch_to_login: "Prepnúť na prihlásenie",
      light_mode: "Svetlý režim",
      dark_mode: "Tmavý režim",
      languages: "Jazyky",
      slovak: "Slovenský",
      czech: "Český",
      english: "Anglický",
      add_item: "Pridať položku",
      add_new_list: "Pridať nový zoznam",
      list_name: "Názov zoznamu",
      add: "Pridať",
      invite_member: "Pozvať člena",
      members: "Členovia",
      remove: "Odstrániť",
    }
  },
  cs: {
    translation: {
      login: "Přihlásit",
      register: "Registrace",
      username: "Uživatelské jméno",
      password: "Heslo",
      welcome: "Vítejte",
      logout: "Odhlásit",
      add_list: "Přidat seznam",
      enter_list_name: "Zadejte název seznamu",
      delete_list: "Smazat seznam",
      manage_members: "Spravovat členy",
      switch_to_register: "Přepnout na registraci",
      switch_to_login: "Přepnout na přihlášení",
      light_mode: "Světlý režim",
      dark_mode: "Tmavý režim",
      languages: "Jazyky",
      slovak: "Slovenský",
      czech: "Český",
      english: "Anglický",
      add_item: "Přidat položku",
      add_new_list: "Přidat nový seznam",
      list_name: "Název seznamu",
      add: "Přidat",
      invite_member: "Pozvat člena",
      members: "Členové",
      remove: "Odstranit",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "sk", // Predvolený jazyk
    fallbackLng: "sk", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
