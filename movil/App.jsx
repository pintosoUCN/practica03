import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const App = () => {
  const [profileData, setProfileData] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5065/api/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditedProfile({ ...profileData });
    setEditingProfile(true);
  };

  const handleSaveClick = async () => {
    try {
      const editedData = {
        profileId: editedProfile.profileId,
        name: editedProfile.name,
        lastname: editedProfile.lastname,
        email: editedProfile.email,
        city: editedProfile.city,
        country: editedProfile.country,
        summary: editedProfile.summary,
        instagram: editedProfile.instagram,
        facebook: editedProfile.facebook,
        age: editedProfile.age,
        imageUrl: editedProfile.imageUrl,
        frameworks: [...editedProfile.frameworks],
        hobbies: [...editedProfile.hobbies],
      };

      await axios.put(`http://localhost:5065/api/profile/${editedProfile.profileId}`, editedData);
      setProfileData(editedData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field, value, index, type) => {
    const copiedProfile = { ...editedProfile };

    if (type === 'frameworks') {
      copiedProfile.frameworks[index][field] = value;
    } else if (type === 'hobbies') {
      copiedProfile.hobbies[index][field] = value;
    } else {
      copiedProfile[field] = value;
    }

    setEditedProfile(copiedProfile);
  };

  return (
    <ScrollView>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>Portafolio personal</Text>
        </View>

        {profileData && (
          <>
            <Image source={{ uri: profileData.imageUrl }} style={styles.profileImage} />

            <Text style={styles.profile}>Nombre: {editingProfile ? (
              <TextInput
                value={editedProfile.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            ) : (
              profileData.name
            )}</Text>

<Text style={styles.profile}>Apellido: {editingProfile ? (
              <TextInput
                value={editedProfile.lastname}
                onChangeText={(value) => handleInputChange('lastname', value)}
              />
            ) : (
              profileData.lastname
            )}</Text>

            <Text style={styles.profile}>Email: {editingProfile ? (
              <TextInput
                value={editedProfile.email}
                onChangeText={(value) => handleInputChange('email', value)}
              />
            ) : (
              profileData.email
            )}</Text>

            <Text style={styles.profile}>Ciudad: {editingProfile ? (
              <TextInput
                value={editedProfile.city}
                onChangeText={(value) => handleInputChange('city', value)}
              />
            ) : (
              profileData.city
            )}</Text>

            <Text style={styles.profile}>Pais: {editingProfile ? (
              <TextInput
                value={editedProfile.country}
                onChangeText={(value) => handleInputChange('country', value)}
              />
            ) : (
              profileData.country
            )}</Text>

            <Text style={styles.profile}>Resumen: {editingProfile ? (
              <TextInput
                value={editedProfile.summary}
                onChangeText={(value) => handleInputChange('summary', value)}
              />
            ) : (
              profileData.summary
            )}</Text>

            <Text style={styles.profile}>Instagram: {editingProfile ? (
              <TextInput
                value={editedProfile.instagram}
                onChangeText={(value) => handleInputChange('instagram', value)}
              />
            ) : (
              profileData.instagram
            )}</Text>

            <Text style={styles.profile}>Facebook: {editingProfile ? (
              <TextInput
                value={editedProfile.facebook}
                onChangeText={(value) => handleInputChange('facebook', value)}
              />
            ) : (
              profileData.facebook
            )}</Text>

            <Text style={styles.profile}>Edad: {editingProfile ? (
              <TextInput
                value={editedProfile.age ? editedProfile.age.toString() : ''}
                onChangeText={(value) => handleInputChange('age', parseInt(value))}
              />
            ) : (
              profileData.age.toString()
            )}</Text>

            <Text style={styles.profile}>URL imagen: {editingProfile ? (
              <TextInput
                value={editedProfile.imageUrl}
                onChangeText={(value) => handleInputChange('imageUrl', value)}
              />
            ) : (
              profileData.imageUrl
            )}</Text>

            <Text style={styles.profile}>{editingProfile ? (
              editedProfile.frameworks.map((framework, index) => (
                <View key={index}>
                  <Text style={styles.profile}>Framework {index + 1}:</Text>
                  <TextInput
                    value={framework.name}
                    onChangeText={(value) => handleInputChange('name', value, index, 'frameworks')}
                  />
                  <TextInput
                    value={framework.level}
                    onChangeText={(value) => handleInputChange('level', value, index, 'frameworks')}
                  />
                  <TextInput
                    value={framework.year ? framework.year.toString() : ''}
                    onChangeText={(value) => handleInputChange('year', value, index, 'frameworks')}
                  />
                </View>
              ))
            ) : (
              profileData.frameworks.map((framework, index) => (
                <View key={index}>
                  <Text style={styles.profile}>Framework {index + 1}:</Text>
                  <Text style={styles.profile}>Name: {framework.name}</Text>
                  <Text style={styles.profile}>Level: {framework.level}</Text>
                  <Text style={styles.profile}>Year: {framework.year}</Text>
                </View>
              ))
            )}</Text>

            <Text style={styles.profile}>{editingProfile ? (
              editedProfile.hobbies.map((hobby, index) => (
                <View key={index}>
                  <Text style={styles.profile}>Hobby {index + 1}:</Text>
                  <TextInput
                    value={hobby.name}
                    onChangeText={(value) => handleInputChange('name', value, index, 'hobbies')}
                  />
                  <TextInput
                    value={hobby.description}
                    onChangeText={(value) => handleInputChange('description', value, index, 'hobbies')}
                  />
                </View>
              ))
            ) : (
              profileData.hobbies.map((hobby, index) => (
                <View key={index}>
                  <Text style={styles.profile}>Hobby {index + 1}:</Text>
                  <Text style={styles.profile}>Name: {hobby.name}</Text>
                  <Text style={styles.profile}>Description: {hobby.description}</Text>
                </View>
              ))
            )}</Text>

            {editingProfile ? (
              <TouchableOpacity style={styles.buttonSave} onPress={handleSaveClick}>
                <Text style={{ color: 'white' }}>Guardar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.buttonEdit} onPress={handleEditClick}>
                <Text style={{ color: 'white' }}>Editar</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  navbarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  profile: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  buttonEdit: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonSave: {
    backgroundColor: '#9CA3AF',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default App;
