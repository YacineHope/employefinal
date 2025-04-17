import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate,useLocation } from "react-router-dom";
import { FaCheckCircle, FaPlus, FaSignOutAlt, FaBed, FaUsers, FaChartLine, FaBell, FaSearch, FaCommentDots, FaTimes } from "react-icons/fa";
import profilereceptioniste from "../assets/profilereceptioniste.webp"; // Assurez-vous que le chemin est correct
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

import "../components/sidebar.css"; // Importez les styles de la barre latérale
import "../Style/receptioniste.css"; // Importez les styles spécifiques au réceptionniste

// Composant Sidebar
const Sidebar = ({ buttons, onButtonClick, activeButton, onLogout, dashboardName, profileImage }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "◄" : "►"}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="profile-section">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <h1>{dashboardName}</h1>
        </div>
        <nav>
          <ul>
            {buttons.map((button, index) => (
              <li
                key={index}
                className={button.name === activeButton ? "active" : ""}
                onClick={() => onButtonClick(button.name)}
              >
                <span className="icon">{button.icon}</span>
                <span className="title">{button.name}</span>
              </li>
            ))}
            <li onClick={onLogout}>
              <span className="icon"><FaSignOutAlt /></span>
              <span className="title">Déconnexion</span>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

// Composant AuthenticateReservation
const AuthenticateReservation = () => {
  const location = useLocation();
  const [reservationNumber, setReservationNumber] = useState(
    location.state?.reservation?.numeroReservation || ""
  );
  const [guestName, setGuestName] = useState(
    `${location.state?.reservation?.nom || ""} ${location.state?.reservation?.prenom || ""}`
  );
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simuler une réponse de l'API
      const fakeResponse = {
        reservation: {
          guest_name: "John Doe",
          room_type: "Chambre Standard",
          check_in_date: "2023-10-15",
          check_out_date: "2023-10-20",
        },
      };
      setReservation(fakeResponse.reservation);
      setError("");
    } catch (err) {
      setError("Réservation non trouvée ou informations incorrectes.");
      setReservation(null);
    }
  };

  return (
    <div className="container authenticate-reservation">
      <h2>Authentifier une Réservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reservationNumber">Numéro de réservation</label>
          <input
            type="text"
            id="reservationNumber"
            placeholder="Numéro de réservation"
            value={reservationNumber}
            onChange={(e) => setReservationNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guestName">Nom du client</label>
          <input
            type="text"
            id="guestName"
            placeholder="Nom du client"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Vérifier</button>
      </form>
      {error && <p className="message error">{error}</p>}
      {reservation && (
        <div className="reservation-details">
          <h3>Détails de la Réservation</h3>
          <p><strong>Nom:</strong> {reservation.guest_name}</p>
          <p><strong>Chambre:</strong> {reservation.room_type}</p>
          <p><strong>Arrivée:</strong> {reservation.check_in_date}</p>
          <p><strong>Départ:</strong> {reservation.check_out_date}</p>
        </div>
      )}
    </div>
  );
};

// Composant RoomManagement

const RoomManagement = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([
    {
      numero: "101",
      type: "Standard",
      etage: 1,
      places: 2,
      etat: "Libre",
      client: null,
      dateArrivee: null,
      dateDepart: null,
      paiement: null,
      services: ["Wi-Fi", "Petit-déjeuner inclus"],
      historique: [
        { client: "John Doe", date: "2025-04-01" },
        { client: "Jane Smith", date: "2025-03-15" },
      ],
    },
    {
      numero: "102",
      type: "Double",
      etage: 1,
      places: 2,
      etat: "Occupée",
      client: "Alice Johnson",
      dateArrivee: "2025-04-10",
      dateDepart: "2025-04-15",
      paiement: "Carte Bancaire",
      services: ["Wi-Fi", "Vue sur la mer"],
      historique: [
        { client: "Bob Brown", date: "2025-03-20" },
        { client: "Charlie Green", date: "2025-03-05" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Tous les Types");
  const [filterEtat, setFilterEtat] = useState("Tous les États");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.numero.toLowerCase().includes(searchTerm);
    const matchesType = filterType === "Tous les Types" || room.type === filterType;
    const matchesEtat = filterEtat === "Tous les États" || room.etat === filterEtat;
    return matchesSearch && matchesType && matchesEtat;
  });

  const handleRoomClick = (room) => {
    navigate("/receptionist/room-details", { state: { room } });
  };

  return (
    <div className="room-management">
      <h1>Gestion des Chambres</h1>

      {/* Barre de recherche */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par numéro de chambre..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Filtres */}
      <div className="filters">
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="Tous les Types">Tous les Types</option>
          <option value="Standard">Standard</option>
          <option value="Double">Double</option>
          <option value="Familiale">Familiale</option>
          <option value="Suite">Suite</option>
        </select>
        <select onChange={(e) => setFilterEtat(e.target.value)} value={filterEtat}>
          <option value="Tous les États">Tous les États</option>
          <option value="Libre">Libre</option>
          <option value="Occupée">Occupée</option>
          <option value="Réservée">Réservée</option>
          <option value="En Nettoyage">En Nettoyage</option>
        </select>
      </div>

      {/* Tableau des chambres */}
      <table className="room-table">
        <thead>
          <tr>
            <th>Numéro de Chambre</th>
            <th>Type</th>
            <th>Étage</th>
            <th>Nombre de Places</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Aucune chambre ne correspond à vos critères.
              </td>
            </tr>
          ) : (
            filteredRooms.map((room) => (
              <tr key={room.numero} onClick={() => handleRoomClick(room)} style={{ cursor: "pointer" }}>
                <td>{room.numero}</td>
                <td>{room.type}</td>
                <td>{room.etage}</td>
                <td>{room.places}</td>
                <td>{room.etat}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Composant ClientsManagement
const ClientsManagement = ({ addNotification }) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("Tous les Statuts");
  const [searchDate, setSearchDate] = useState("");
  const [clientForm, setClientForm] = useState({
    nom: "",
    prenom: "",
    numeroChambre: "",
    dateNaissance: "",
    lieuNaissance: "",
    adresse: "",
    email: "",
    numeroID: "",
    natureID: "",
    statut: "",
  });
const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  const handleSaveClient = () => {
    if (clientForm.nom && clientForm.prenom) {
      setClients([
        ...clients,
        {
          ...clientForm,
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      alert("Client enregistré avec succès !");
      setClientForm({
        nom: "",
        prenom: "",
        numeroChambre: "",
        dateNaissance: "",
        lieuNaissance: "",
        adresse: "",
        email: "",
        numeroID: "",
        natureID: "",
        statut: "",
      });
    } else {
      alert("Veuillez remplir tous les champs obligatoires !");
    }
  };

  const handleEditClient = (id) => {
    const clientToEdit = clients.find((client) => client.id === id);
    setClientForm(clientToEdit);
  };

  const handleUpdateClient = () => {
    if (window.confirm("Voulez-vous vraiment changer les informations de ce client ?")) {
      setClients(
        clients.map((client) =>
          client.id === clientForm.id ? { ...clientForm } : client
        )
      );
      addNotification(`Les informations du client ${clientForm.nom} ${clientForm.prenom} ont été modifiées avec succès.`);
      setClientForm({
        nom: "",
        prenom: "",
        numeroChambre: "",
        dateNaissance: "",
        lieuNaissance: "",
        adresse: "",
        email: "",
        numeroID: "",
        natureID: "",
        statut: "",
      });
    }
  };

  const handleViewDetails = (client) => {
    navigate("/receptionist/client-details", { state: { client } });
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toString().includes(searchTerm);
    const matchesStatus = searchStatus === "Tous les Statuts" || client.statut === searchStatus;
    const matchesDate = !searchDate || client.date === searchDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="clients-management">
      <h1>Gestion des Clients</h1>

      {/* Formulaire */}
      <div className="client-form">
        <h2>Formulaire Client</h2>
        <form>
          <div className="form-group">
            <label htmlFor="nom">
              <span className="required">*</span> Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={clientForm.nom}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">
              <span className="required">*</span> Prénom
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={clientForm.prenom}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="numeroChambre">Numéro de Chambre</label>
            <input
              type="text"
              id="numeroChambre"
              name="numeroChambre"
              value={clientForm.numeroChambre}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateNaissance">Date de Naissance</label>
            <input
              type="date"
              id="dateNaissance"
              name="dateNaissance"
              value={clientForm.dateNaissance}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lieuNaissance">Lieu de Naissance</label>
            <input
              type="text"
              id="lieuNaissance"
              name="lieuNaissance"
              value={clientForm.lieuNaissance}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="adresse">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={clientForm.adresse}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={clientForm.email}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numeroID">
              <span className="required">*</span> Numéro d'ID
            </label>
            <input
              type="text"
              id="numeroID"
              name="numeroID"
              value={clientForm.numeroID}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="natureID">
              <span className="required">*</span> Nature d'ID
            </label>
            <input
              type="text"
              id="natureID"
              name="natureID"
              value={clientForm.natureID}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="statut">Statut</label>
            <select
              id="statut"
              name="statut"
              value={clientForm.statut}
              onChange={handleFormChange}
            >
              <option value="">Sélectionnez un statut</option>
              <option value="Simple">Simple</option>
              <option value="Fidèle">Fidèle</option>
              <option value="Liste Noire">Liste Noire</option>
            </select>
          </div>
          <button type="button" onClick={handleSaveClient} className="btn">
            Enregistrer
          </button>
          {clientForm.id && (
            <button type="button" onClick={handleUpdateClient} className="btn edit">
              Modifier
            </button>
          )}
        </form>
      </div>

      {/* Client Info */}
      <div className="client-info">
        <h2>Informations des Clients</h2>

        {/* Barre de recherche */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro d'ordre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtres */}
        <div className="filters">
          <select onChange={(e) => setSearchStatus(e.target.value)} value={searchStatus}>
            <option value="Tous les Statuts">Tous les Statuts</option>
            <option value="Simple">Simple</option>
            <option value="Fidèle">Fidèle</option>
            <option value="Liste Noire">Liste Noire</option>
          </select>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        {/* Tableau des clients */}
        <table className="client-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun client ne correspond à vos critères.
                </td>
              </tr>
            ) : (
              filteredClients.map((client, index) => (
                <tr key={client.id}>
                  <td>{index + 1}</td>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>
                    <button
                      onClick={() => handleEditClient(client.id)}
                      className="btn edit"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleViewDetails(client)}
                      className="btn details"
                    >
                      Voir les détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant Statistics

const Statistics = ({ stats }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/receptionist/detailed-statistics", { state: { stats } });
  };

  return (
    <div className="container statistics">
      <h2>Statistiques</h2>
      <div className="stats-grid">
        <div className="stat-card" onClick={handleViewDetails}>
          <h3>Réservations totales</h3>
          <p>{stats.totalReservations}</p>
        </div>
        <div className="stat-card" onClick={handleViewDetails}>
          <h3>Chambres occupées</h3>
          <p>{stats.occupiedRooms}</p>
        </div>
        <div className="stat-card" onClick={handleViewDetails}>
          <h3>Chambres disponibles</h3>
          <p>{stats.freeRooms}</p>
        </div>
        <div className="stat-card" onClick={handleViewDetails}>
          <h3>Clients</h3>
          <p>{stats.totalClients}</p>
        </div>
      </div>
    </div>
  );
};


//Composant DetailedStatistics
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DetailedStatistics = ({ stats }) => {
  // Données pour les graphiques
  const reservationData = {
    labels: ["Acceptées", "Refusées", "Annulées", "Modifiées"],
    datasets: [
      {
        label: "Réservations",
        data: [
          stats.acceptedReservations,
          stats.rejectedReservations,
          stats.canceledReservations,
          stats.modifiedReservations,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#03a9f4"],
      },
    ],
  };

  const roomData = {
    labels: ["Occupées", "Réservées", "Libres"],
    datasets: [
      {
        label: "Chambres",
        data: [stats.occupiedRooms, stats.reservedRooms, stats.freeRooms],
        backgroundColor: ["#6200ea", "#ff5722", "#8bc34a"],
      },
    ],
  };

  const clientData = {
    labels: ["Simples", "Fidèles", "Listes Noires"],
    datasets: [
      {
        label: "Clients",
        data: [stats.simpleClients, stats.loyalClients, stats.blacklistClients],
        backgroundColor: ["#2196f3", "#ffeb3b", "#9e9e9e"],
      },
    ],
  };

  return (
    <div className="detailed-statistics">
      <h1>Statistiques Détaillées</h1>

      <div className="chart-container">
        <h2>Réservations</h2>
        <Bar data={reservationData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>

      <div className="chart-container">
        <h2>Chambres</h2>
        <Bar data={roomData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>

      <div className="chart-container">
        <h2>Clients</h2>
        <Bar data={clientData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    </div>
  );
};

// Composant ReservationList
const ReservationList = ({ addNotification }) => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      numeroReservation: "R001",
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      telephone: "123-456-7890",
      typeChambre: "Standard",
      nombrePersonne: 2,
      dateArrivee: "2025-04-15",
      dateDepart: "2025-04-20",
      dureeAttente: "2 heures",
      status: null,
    },
    {
      id: 2,
      numeroReservation: "R002",
      nom: "Smith",
      prenom: "Jane",
      email: "jane.smith@example.com",
      telephone: "987-654-3210",
      typeChambre: "Double",
      nombrePersonne: 3,
      dateArrivee: "2025-04-18",
      dateDepart: "2025-04-22",
      dureeAttente: "1 jour",
      status: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedReservation, setExpandedReservation] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleDetails = (id) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  const handleAuthenticate = (reservation) => {
    navigate("/receptionist/authenticate", { state: { reservation } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
      const deletedReservation = reservations.find((r) => r.id === id);
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== id)
      );
      addNotification({
        message: `La réservation ${deletedReservation.numeroReservation} est supprimée avec succès.`,
      });
    }
  };

  const handleAction = (id, action) => {
    const reservation = reservations.find((r) => r.id === id);

    if (action === "Acceptée") {
      if (window.confirm(`Voulez-vous accepter la réservation ${reservation.numeroReservation} ?`)) {
        const updatedReservations = reservations.map((r) =>
          r.id === id ? { ...r, status: action } : r
        );
        setReservations(updatedReservations);

        addNotification({
          message: `La réservation ${reservation.numeroReservation} est acceptée avec succès.`,
          reservation, // Inclure les informations de la réservation dans la notification
        });
      }
    } else {
      const updatedReservations = reservations.map((r) =>
        r.id === id ? { ...r, status: action } : r
      );
      setReservations(updatedReservations);

      addNotification({
        message: `La réservation ${reservation.numeroReservation} est refusée avec succès.`,
      });
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    return (
      reservation.numeroReservation.toLowerCase().includes(searchTerm) ||
      reservation.nom.toLowerCase().includes(searchTerm) ||
      reservation.prenom.toLowerCase().includes(searchTerm) ||
      reservation.typeChambre.toLowerCase().includes(searchTerm) ||
      reservation.telephone.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container reservation-list">
      <h2>Liste des Réservations</h2>

      {/* Barre de recherche */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par numéro, nom, prénom, type de chambre, téléphone..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredReservations.length === 0 ? (
        <p className="no-reservations">Aucune réservation pour l'instant!</p>
      ) : (
        filteredReservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-summary">
              <p>
                <strong>Numéro de Réservation:</strong> {reservation.numeroReservation}
              </p>
              <p>
                <strong>Nom:</strong> {reservation.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {reservation.prenom}
              </p>
              <p>
                <strong>Email:</strong> {reservation.email}
              </p>
              {reservation.status ? (
                <div className="status-container">
                  <span
                    className={`status ${
                      reservation.status === "Acceptée" ? "accepted" : "rejected"
                    }`}
                  >
                    {reservation.status}
                  </span>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="btn accept"
                    onClick={() => handleAction(reservation.id, "Acceptée")}
                  >
                    Accepter
                  </button>
                  <button
                    className="btn reject"
                    onClick={() => handleAction(reservation.id, "Refusée")}
                  >
                    Refuser
                  </button>
                </>
              )}
              <button
                className="btn details"
                onClick={() => toggleDetails(reservation.id)}
              >
                {expandedReservation === reservation.id
                  ? "Fermer les détails"
                  : "Voir les détails"}
              </button>
              <button
                className="btn authenticate"
                onClick={() => handleAuthenticate(reservation)}
              >
                Authentifier
              </button>
            </div>
            {expandedReservation === reservation.id && (
              <div className="reservation-details">
                <p>
                  <strong>Téléphone:</strong> {reservation.telephone}
                </p>
                <p>
                  <strong>Type de Chambre:</strong> {reservation.typeChambre}
                </p>
                <p>
                  <strong>Nombre de Personnes:</strong> {reservation.nombrePersonne}
                </p>
                <p>
                  <strong>Date d'Arrivée:</strong> {reservation.dateArrivee}
                </p>
                <p>
                  <strong>Date de Départ:</strong> {reservation.dateDepart}
                </p>
                <p>
                  <strong>Durée d'Attente:</strong> {reservation.dureeAttente}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

// Composant ReservationManagement
const ReservationManagement = ({ reservationForm, setReservationForm, addNotification }) => {
  const [roomInfo, setRoomInfo] = useState([]);
  const [canceledReservations, setCanceledReservations] = useState([]);
  const [filterEtat, setFilterEtat] = useState("Tous les Chambres");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateDates = () => {
    if (reservationForm?.dateDepart < reservationForm?.dateArrivee) {
      setErrorMessage("La date de départ doit être supérieure ou égale à la date d'arrivée.");
      return false;
    }
    setErrorMessage(""); // Réinitialiser le message d'erreur si la validation passe
    return true;
  };

  const validateForm = () => {
    const errors = {};

    if (!reservationForm?.numeroReservation) {
      errors.numeroReservation = "Le numéro de réservation est requis.";
    }
    if (!reservationForm?.nom) {
      errors.nom = "Le nom est requis.";
    }
    if (!reservationForm?.prenom) {
      errors.prenom = "Le prénom est requis.";
    }
    if (!reservationForm?.dateArrivee) {
      errors.dateArrivee = "La date d'arrivée est requise.";
    }
    if (!reservationForm?.dateDepart) {
      errors.dateDepart = "La date de départ est requise.";
    } else if (reservationForm?.dateDepart < reservationForm?.dateArrivee) {
      errors.dateDepart = "La date de départ doit être supérieure ou égale à la date d'arrivée.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retourne true si aucun champ n'a d'erreur
  };

  const handleConfirmReservation = () => {
    if (!validateForm()) {
      return; // Arrêter l'exécution si la validation échoue
    }
  
    setRoomInfo([
      ...roomInfo,
      {
        ...reservationForm,
        client: `${reservationForm.nom} ${reservationForm.prenom}`,
      },
    ]);
    alert(`La réservation ${reservationForm.numeroReservation} a été ajoutée avec succès.`);
    setReservationForm(null); // Réinitialiser le formulaire
    setFormErrors({}); // Réinitialiser les erreurs
  };

  const handleCancelReservation = (numeroReservation) => {
    if (window.confirm(`Voulez-vous vraiment annuler la réservation ${numeroReservation} ?`)) {
      const canceled = roomInfo.find((room) => room.numeroReservation === numeroReservation);
      setCanceledReservations([...canceledReservations, canceled]);
      setRoomInfo(roomInfo.filter((room) => room.numeroReservation !== numeroReservation));

      // Ajouter une notification
      addNotification({
        message: `La réservation ${numeroReservation} est annulée avec succès.`,
      });
    }
  };

  const handleEditReservation = (numeroReservation) => {
    const roomToEdit = roomInfo.find((room) => room.numeroReservation === numeroReservation);
    setReservationForm({
      numeroReservation: roomToEdit.numeroReservation,
      nom: roomToEdit.client.split(" ")[0],
      prenom: roomToEdit.client.split(" ")[1],
      numeroChambre: roomToEdit.numeroChambre,
      etat: roomToEdit.etat,
      dateArrivee: roomToEdit.dateArrivee,
      dateDepart: roomToEdit.dateDepart,
    });
  };

  const handleUpdateReservation = () => {
    if (window.confirm("Voulez-vous vraiment modifier ce tuple ?")) {
      setRoomInfo(
        roomInfo.map((room) =>
          room.numeroReservation === reservationForm.numeroReservation
            ? { ...reservationForm, client: `${reservationForm.nom} ${reservationForm.prenom}` }
            : room
        )
      );

      // Ajouter une notification
      addNotification({
        message: `La réservation ${reservationForm.numeroReservation} est modifiée avec succès.`,
      });

      setReservationForm(null); // Réinitialiser le formulaire
    }
  };


  const filteredRoomInfo = roomInfo.filter((room) => {
    if (filterEtat === "Tous les Chambres") return true;
    return room.etat === filterEtat;
  });

  const today = new Date().toISOString().split("T")[0];
  const roomsToVacateToday = roomInfo.filter((room) => room.dateDepart === today);

  return (
    <div className="reservation-management">
      <h1>Gestion des Réservations</h1>

      {/* Reservation Form */}
      <div className="reservation-form">
        <h2>Formulaire de Réservation</h2>
        <form>
          <div className="form-group">
            <label htmlFor="numeroReservation">
              Numéro de Réservation <span className="required">*</span>
            </label>
            <input
              type="text"
              id="numeroReservation"
              name="numeroReservation"
              value={reservationForm?.numeroReservation || ""}
              onChange={(e) =>
                setReservationForm({ ...reservationForm, numeroReservation: e.target.value })
              }
              required
            />
            {formErrors.numeroReservation && <p className="error-message">{formErrors.numeroReservation}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="nom">
              Nom <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={reservationForm?.nom || ""}
              onChange={(e) => setReservationForm({ ...reservationForm, nom: e.target.value })}
              required
            />
            {formErrors.nom && <p className="error-message">{formErrors.nom}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="prenom">
              Prénom <span className="required">*</span>
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={reservationForm?.prenom || ""}
              onChange={(e) => setReservationForm({ ...reservationForm, prenom: e.target.value })}
              required
            />
            {formErrors.prenom && <p className="error-message">{formErrors.prenom}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="numeroChambre">Numéro de Chambre</label>
            <input
              type="text"
              id="numeroChambre"
              name="numeroChambre"
              value={reservationForm?.numeroChambre || ""}
              onChange={(e) =>
                setReservationForm({ ...reservationForm, numeroChambre: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="etat">État</label>
            <select
              id="etat"
              name="etat"
              value={reservationForm?.etat || ""}
              onChange={(e) => setReservationForm({ ...reservationForm, etat: e.target.value })}
              required
            >
              <option value="">Sélectionnez un état</option>
              <option value="Occupée">Occupée</option>
              <option value="Réservée">Réservée</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dateArrivee">
              Date d'Arrivée <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dateArrivee"
              name="dateArrivee"
              value={reservationForm?.dateArrivee || ""}
              onChange={(e) =>
                setReservationForm({ ...reservationForm, dateArrivee: e.target.value })
              }
              required
            />
            {formErrors.dateArrivee && <p className="error-message">{formErrors.dateArrivee}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="dateDepart">
              Date de Départ <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dateDepart"
              name="dateDepart"
              value={reservationForm?.dateDepart || ""}
              onChange={(e) =>
                setReservationForm({ ...reservationForm, dateDepart: e.target.value })
              }
              required
            />
            {formErrors.dateDepart && <p className="error-message">{formErrors.dateDepart}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <div className="form-buttons">
            <button type="button" onClick={handleConfirmReservation} className="btn confirm">
              Confirmer
            </button>
            {reservationForm && (
              <button type="button" onClick={handleUpdateReservation} className="btn edit">
                Modifier
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCancelReservation(reservationForm?.numeroReservation)}
              className="btn cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* Room Info */}
      <div className="room-info">
        <h2>Informations des Chambres</h2>
        <select onChange={(e) => setFilterEtat(e.target.value)} value={filterEtat}>
          <option value="Tous les Chambres">Tous les Chambres</option>
          <option value="Libre">Libre</option>
          <option value="Réservée">Réservée</option>
          <option value="Occupée">Occupée</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>Numéro de Réservation</th>
              <th>Numéro de Chambre</th>
              <th>Client</th>
              <th>État</th>
              <th>Date d'Arrivée</th>
              <th>Date de Départ</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoomInfo.map((room) => (
              <tr key={room.numeroReservation}>
                <td>{room.numeroReservation}</td>
                <td>{room.numeroChambre}</td>
                <td>{room.client}</td>
                <td>{room.etat}</td>
                <td>{room.dateArrivee}</td>
                <td>{room.dateDepart}</td>
                <td>
                  <button onClick={() => handleEditReservation(room.numeroReservation)} className="btn edit">
                    Modifier
                  </button>
                  <button onClick={() => handleCancelReservation(room.numeroReservation)} className="btn cancel">
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Room Vacated Today */}
      <div className="room-vocated-today">
        <h2>Chambres Libérées Aujourd'hui</h2>
        <table>
          <thead>
            <tr>
              <th>Numéro de Chambre</th>
              <th>Nombre de Places</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {roomsToVacateToday.map((room, index) => (
              <tr key={index}>
                <td>{room.numeroChambre}</td>
                <td>{room.nombrePersonne || "N/A"}</td>
                <td>{room.client}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Canceled Reservations */}
      <div className="canceled-reservations">
        <h2>Réservations Annulées</h2>
        <table>
          <thead>
            <tr>
              <th>Numéro de Réservation</th>
              <th>Numéro de Chambre</th>
              <th>Client</th>
              <th>Date d'Arrivée</th>
              <th>Date de Départ</th>
            </tr>
          </thead>
          <tbody>
            {canceledReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.numeroReservation}</td>
                <td>{reservation.numeroChambre}</td>
                <td>{reservation.client}</td>
                <td>{reservation.dateArrivee}</td>
                <td>{reservation.dateDepart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant RoomDetails



const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room; // Récupérer les détails de la chambre depuis la navigation

  if (!room) {
    return (
      <div className="room-details">
        <h2>Aucune chambre sélectionnée</h2>
        <button className="btn" onClick={() => navigate("/receptionist/room-management")}>
          Retour à la gestion des chambres
        </button>
      </div>
    );
  }

  return (
    <div className="room-details">
      <h1>Détails de la Chambre</h1>
      <p>
        <strong>Numéro de Chambre :</strong> {room.numero}
      </p>
      <p>
        <strong>Type :</strong> {room.type}
      </p>
      <p>
        <strong>Étage :</strong> {room.etage}
      </p>
      <p>
        <strong>État :</strong> {room.etat}
      </p>
      <p>
        <strong>Nombre de Places :</strong> {room.places}
      </p>
      {room.client && (
        <p>
          <strong>Client Actuel :</strong> {room.client}
        </p>
      )}
      {room.dateArrivee && room.dateDepart && (
        <p>
          <strong>Dates de Réservation :</strong> {room.dateArrivee} - {room.dateDepart}
        </p>
      )}
      {room.paiement && (
        <p>
          <strong>Type de Paiement :</strong> {room.paiement}
        </p>
      )}
      {room.services && (
        <p>
          <strong>Services Supplémentaires :</strong> {room.services.join(", ")}
        </p>
      )}
      {room.historique && (
        <div>
          <strong>Historique de la Chambre :</strong>
          <ul>
            {room.historique.map((entry, index) => (
              <li key={index}>
                {entry.client} - {entry.date}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn" onClick={() => navigate("/receptionist/room-management")}>
        Retour à la gestion des chambres
      </button>
    </div>
  );
};

// Composant ClientDetails

const ClientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const client = location.state?.client;

  if (!client) {
    return (
      <div className="client-details">
        <h2>Aucun client sélectionné</h2>
        <button className="btn" onClick={() => navigate("/receptionist/client-management")}>
          Retour à la gestion des clients
        </button>
      </div>
    );
  }

  return (
    <div className="client-details">
      <h1>Détails du Client</h1>
      <p><strong>Nom :</strong> {client.nom}</p>
      <p><strong>Prénom :</strong> {client.prenom}</p>
      <p><strong>Numéro de Chambre :</strong> {client.numeroChambre}</p>
      <p><strong>Date de Naissance :</strong> {client.dateNaissance}</p>
      <p><strong>Lieu de Naissance :</strong> {client.lieuNaissance}</p>
      <p><strong>Adresse :</strong> {client.adresse}</p>
      <p><strong>Email :</strong> {client.email}</p>
      <p><strong>Numéro d'ID :</strong> {client.numeroID}</p>
      <p><strong>Nature d'ID :</strong> {client.natureID}</p>
      <p><strong>Statut :</strong> {client.statut}</p>
      <button className="btn" onClick={() => alert("Contactez le client !")}>
        Contacter
      </button>
      <button className="btn" onClick={() => navigate("/receptionist/client-management")}>
        Retour
      </button>
    </div>
  );
};

// Composant Chat



const Chat = () => {
  const [clients, setClients] = useState([
    { id: 1, nom: "John Doe" },
    { id: 2, nom: "Jane Smith" },
    { id: 3, nom: "Alice Johnson" },
  ]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    if (!messages[client.id]) {
      setMessages({ ...messages, [client.id]: [] });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedMessages = {
      ...messages,
      [selectedClient.id]: [
        ...(messages[selectedClient.id] || []),
        { sender: "receptionist", text: newMessage, timestamp: new Date() },
      ],
    };
    setMessages(updatedMessages);
    setNewMessage("");
  };

  const handleReceiveMessage = (clientId, text) => {
    const updatedMessages = {
      ...messages,
      [clientId]: [
        ...(messages[clientId] || []),
        { sender: "client", text, timestamp: new Date() },
      ],
    };
    setMessages(updatedMessages);
  };

  // Simuler un message reçu après 5 secondes pour démonstration
  useEffect(() => {
    if (selectedClient) {
      const timeout = setTimeout(() => {
        handleReceiveMessage(selectedClient.id, "Bonjour, comment puis-je vous aider ?");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [selectedClient]);

  return (
    <div className="chat-container">
      <div className="client-list">
        <h2>Liste des Clients</h2>
        <ul>
          {clients.map((client) => (
            <li
              key={client.id}
              className={selectedClient?.id === client.id ? "active" : ""}
              onClick={() => handleSelectClient(client)}
            >
              {client.nom}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {selectedClient ? (
          <>
            <div className="chat-header">
              <h2>Conversation avec {selectedClient.nom}</h2>
            </div>
            <div className="chat-messages">
              {messages[selectedClient.id]?.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === "receptionist" ? "sent" : "received"}`}
                >
                  <p>{message.text}</p>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Écrivez un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Envoyer</button>
            </div>
          </>
        ) : (
          <div className="no-client-selected">
            <p>Sélectionnez un client pour commencer une conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant ReceptionistDashboard
const ReceptionistDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState([]);

const removeNotification = (index) => {
  setNotifications((prevNotifications) =>
    prevNotifications.filter((_, i) => i !== index)
  );
};
  const [showNotifications, setShowNotifications] = useState(false);
  const [reservationForm, setReservationForm] = useState(null); // Stocker les données du formulaire
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveSection(buttonName.toLowerCase().replace(/ /g, "_"));
    switch (buttonName) {
      
      case "Authentifier une Réservation":
        navigate("/receptionist/authenticate");
        break;
      case "Statistiques":
        navigate("/receptionist/statistics");
        break;
      case "Liste des Réservations":
        navigate("/receptionist/reservation-list");
        break;
      case "Gestion des Réservations":
        navigate("/receptionist/reservation-management");
        break;
      case "Gestion des Chambres":
        navigate("/receptionist/room-management");
        break;
      case "Gestion des Clients":
        navigate("/receptionist/client-management");
        break;
      case "Chat":
        navigate("/receptionist/chat");
        break;
      default:
        navigate("/receptionist");
        break;
    }
  };

  const handleLogout = () => {
    alert("Déconnexion réussie");
    navigate("/"); // Rediriger vers la page d'accueil ou de connexion
  };

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };

const handleAddToForm = (reservation) => {
  setReservationForm(reservation); // Pré-remplir le formulaire
  navigate("/receptionist/reservation-management");
};

const [reservations, setReservations] = useState([]);
const [canceledReservations, setCanceledReservations] = useState([]);
const [roomInfo, setRoomInfo] = useState([]);
const [clients, setClients] = useState([]);

const stats = {
  totalReservations: reservations.length,
  acceptedReservations: reservations.filter((r) => r.status === "Acceptée").length,
  rejectedReservations: reservations.filter((r) => r.status === "Refusée").length,
  canceledReservations: canceledReservations.length,
  modifiedReservations: roomInfo.filter((r) => r.modified).length,
  occupiedRooms: roomInfo.filter((r) => r.etat === "Occupée").length,
  reservedRooms: roomInfo.filter((r) => r.etat === "Réservée").length,
  freeRooms: roomInfo.filter((r) => r.etat === "Libre").length,
  simpleClients: clients.filter((c) => c.statut === "Simple").length,
  loyalClients: clients.filter((c) => c.statut === "Fidèle").length,
  blacklistClients: clients.filter((c) => c.statut === "Liste Noire").length,
  totalClients: clients.length,
};

  return (
    <div className="dashboard-container">
      {/* Barre latérale */}
      <Sidebar
        buttons={[
          { name: "Authentifier une Réservation", icon: <FaCheckCircle /> },
          { name: "Statistiques", icon: <FaChartLine /> },
          { name: "Liste des Réservations", icon: <FaChartLine /> },
          { name: "Gestion des Réservations", icon: <FaPlus /> },
          { name: "Gestion des Chambres", icon: <FaBed /> },
          { name: "Gestion des Clients", icon: <FaUsers /> },
          { name: "Chat", icon: <FaCommentDots /> },
        ]}
        onButtonClick={handleButtonClick}
        activeButton={activeSection}
        onLogout={handleLogout}
        dashboardName="Tableau de Bord Réceptionniste"
        profileImage={profilereceptioniste}
      />

      {/* Contenu principal */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Tableau de Bord Réceptionniste</h1>
          {/* Notification Button */}
          <div className="notification-container">
            <button
              className="btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </button>
          </div>
        </header>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="notifications-panel">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
              <p>Aucune notification</p>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <p>{notification.message}</p>
                  {notification.reservation && (
                    <button
                      className="btn"
                      onClick={() => handleAddToForm(notification.reservation)}
                    >
                      Ajouter
                    </button>
                  )}
                  <button
                    className="btn delete"
                    onClick={() => removeNotification(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <Routes>
          <Route path="/authenticate" element={<AuthenticateReservation />} />
           <Route path="/statistics" element={<Statistics stats={stats} />} />
           <Route path="/detailed-statistics" element={<DetailedStatistics stats={stats} />} />
          <Route path="/reservation-list" element={<ReservationList addNotification={addNotification} />} />
          <Route path="/reservation-management" element={<ReservationManagement reservationForm={reservationForm} setReservationForm={setReservationForm} addNotification={addNotification} />} />
          <Route path="/room-management" element={<RoomManagement />} />
          <Route path="/room-details" element={<RoomDetails />} />
          <Route path="/client-management" element={<ClientsManagement addNotification={addNotification} />} />
          <Route path="/client-details" element={<ClientDetails />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

