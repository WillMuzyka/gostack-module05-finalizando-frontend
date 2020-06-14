import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      const response = await api.post('/foods', { ...food, available: true });
      const newFood = response.data;

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API
    const updatingFoods = [...foods];
    const updatingFoodIndex = foods.findIndex(
      oneFood => oneFood.id === editingFood.id,
    );

    const response = await api.put(`/foods/${editingFood.id}`, {
      ...food,
      available: foods[updatingFoodIndex].available,
    });
    const updatedFood = response.data;

    updatingFoods.splice(updatingFoodIndex, 1, updatedFood);

    setFoods([...updatingFoods]);
    setEditingFood({} as IFoodPlate);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    const updatingFoods = [...foods];
    const deletingFoodIndex = foods.findIndex(oneFood => oneFood.id === id);
    updatingFoods.splice(deletingFoodIndex, 1);

    await api.delete(`/foods/${id}`);
    setFoods([...updatingFoods]);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    toggleEditModal();
  }

  async function handleEditAvailability(id: number): Promise<void> {
    // SET THE CURRENT FOOD AVAILABILITY
    const updatingFoods = [...foods];
    const updatingFoodIndex = foods.findIndex(oneFood => oneFood.id === id);

    const response = await api.put(`/foods/${id}`, {
      ...foods[updatingFoodIndex],
      available: !foods[updatingFoodIndex].available,
    });
    const updatedFood = response.data;

    updatingFoods.splice(updatingFoodIndex, 1, updatedFood);

    setFoods([...updatingFoods]);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleEditAvailability={handleEditAvailability}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
