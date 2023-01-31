import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { db } from "../../firebase-config";
import { updateDoc,doc,collection, addDoc,arrayUnion,arrayRemove} from "firebase/firestore"; 
import { auth } from "../../firebase-config";
import { useState,useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import Search from "./Search";
import Search1 from "./Search1";

const subjects = [
  { name: 'Relevence', href: '#', current: true },
  { name: 'Rating', href: '#', current: false },
  { name: 'Alphabetical', href: '#', current: false },
]

const filters = [
  {
    id: 'color',
    name: 'Exam',
    options: [
      { value: 'white', label: 'IIT-JEE', checked: false },
      { value: 'beige', label: 'NEET', checked: false },
      { value: 'blue', label: 'UPSC', checked: true },
    ],
  },
  {
    id: 'category',
    name: 'Language',
    options: [
      { value: 'new-arrivals', label: 'English', checked: false },
      { value: 'sale', label: 'Hindi', checked: false },
      { value: 'travel', label: 'Tamil', checked: true },
      { value: 'organization', label: 'Telgu', checked: false },
      { value: 'accessories', label: 'Malayalam', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Level',
    options: [
      { value: '2l', label: 'Intermediate', checked: false },
      { value: '6l', label: 'Easy', checked: false },
      { value: '12l', label: 'Advanced', checked: false },
    ],
  },
]

const subCategories = [
  { name: 'Physics', href: '#' },
  { name: 'Chemistry', href: '#' },
  { name: 'Maths', href: '#' },
  { name: 'Biology', href: '#' },
]



const products = [
    {
        id: 1,
        name: 'Physics',
        price: 'Rishwanth K',
        imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
      },
      {
        id: 2,
        name: 'Chemistry',
        price: 'Pranav Makur',
        imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
      },
      {
        id: 3,
        name: 'Biology',
        price: 'Gosalya G',
        imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
      },
      {
        id: 4,
        name: 'Maths',
        price: 'Timberlake Chan',
        imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
      },
    {
      id: 1,
      name: 'Physics',
      price: 'Rishwanth K',
      imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
      imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    },
    {
      id: 2,
      name: 'Chemistry',
      price: 'Pranav Makur',
      imageSrc:'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
      imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
    },
    {
      id: 3,
      name: 'Biology',
      
      price: 'Gosalya G',
      imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
      imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    },
    {
      id: 4,
      name: 'Maths',
      price: 'Timberlake Chan',
      imageSrc: 'src\\assets\\undraw_Male_avatar_re_nyu5 (1).png',
      imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
    },
    // More products...
  ]
  function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
  
  export default function Mentors() {
   const currentUser = auth.currentUser;
   const [incomingRequests, setIncomingRequests] = useState([]);
   const [isButtonVisible, setIsButtonVisible] = useState(false);
   const [friends,setFriends] = useState([]);
   const [toggle,setToggle] = useState(false);


    function handleFriendRequest() {
             // Get current user
             const currentUser = auth.currentUser;
             // Reference current user's document in the "users" collection
             const currentUserRef = doc(db,"users","OlspoWznSsmQ4XLfjRvN");
           
             // Reference friend's document in the "users" collection
             const friendRef = doc(db,"users","N7YBLxRR7rB5Ys9ykV1p");
           
             // Add friendId to current user's pendingFriendRequests
             updateDoc(currentUserRef,{
               pendingFriendRequests: arrayUnion("N7YBLxRR7rB5Ys9ykV1p")
             });
           
             // Add current user's id to friend's incomingFriendRequests
             updateDoc(friendRef,{
               incomingFriendRequests: arrayUnion("OlspoWznSsmQ4XLfjRvN")
             });       
    }


    function handleAcceptRequest(index) {    
      // Reference current user's document in the "users" collection
      const currentUserRef = doc(db,"users","OlspoWznSsmQ4XLfjRvN");
    
      // Reference friend's document in the "users" collection
      const friendRef = doc(db,"users","N7YBLxRR7rB5Ys9ykV1p");

      // Add friendId to current user's friends
      updateDoc(currentUserRef,{
        friends: arrayUnion("N7YBLxRR7rB5Ys9ykV1p")
      });
    
      // Add current user's id to friend's friends
      updateDoc(friendRef,{
        friends: arrayUnion("OlspoWznSsmQ4XLfjRvN")
      });

      // remove friend request from pending list
      updateDoc(currentUserRef,{
        pendingFriendRequests: arrayRemove("N7YBLxRR7rB5Ys9ykV1p")
      });

      updateDoc(friendRef,{
        incomingFriendRequests: arrayRemove("OlspoWznSsmQ4XLfjRvN")
      });
    }

    useEffect(() => {
      const unsub = onAuthStateChanged(auth,(user) => {
        if (user) {
    // Get the user document from the "users" collection
    const unsubscribe = onSnapshot(doc(db, "users", "N7YBLxRR7rB5Ys9ykV1p"), (doc) => {
      // check if the data is from the server or local
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(doc.data());
      setIncomingRequests(doc.data().incomingFriendRequests);
      setFriends(doc.data().friends);
      console.log("r",incomingRequests);
      if (friends.length > 0) {
        setIsButtonVisible(true);
      }
    });
    return () => unsubscribe();
  }
});
  return () => unsub();
  
}, []);

  
    return (
        <>
        <Navigation />
      <div className="bg-black flex text-yellow">
        <div className="w-1/4 p-5">
          <h2 className="bold decoration-8 font-semibold">Filters</h2>
          <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a href={category.href} className="block px-2 py-3">
                            {category.name}
                          </a>
                        </li>
                      ))}
                 <div class="ml-0 flex items-center justify-between">
                  <h3 className="text-yellow">Online</h3>
	<input
        type="checkbox"
        class="appearance-none w-9 focus:outline-none checked:bg-yellow-28 h-5 bg-gray-300 rounded-full before:inline-block before:rounded-full before:bg-yellow-89 before:h-4 before:w-4 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-0.5"
        checked={toggle}
        onChange={()=>setToggle(true)}
    />
</div>
                    </ul>


                    {filters.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-yellow px-2 py-3 text-black hover:text-gray-500">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
        </div>
        <div className="w-full">
        <div className="flex text-yellow justify-between p-8 ">
        {toggle ?<p className="text-2xl bold text-yellow decoration-8 font-semibold flex">Mentors Online<div className="myAnim bg-green w-3 h-3 p-2.5 ml-1 mt-0 rounded-full items-center justify-center"></div></p>: <p className="text-2xl bold text-yellow decoration-8 font-semibold flex">Mentors Available</p>}
        
             <div className="flex items-center">
             <div className="pr-3 pt-1/2"><Search1/></div>
              <Menu as="div" className="relative inline-block text-left flex">
                <div>
                  <Menu.Button className="ml-5 group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div> 

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="text-black absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-yellow shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {subjects.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>

                  </Menu.Items>
                  
                  
                </Transition>
              </Menu>
      
              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>


            
          </div>
        <div className="text-yellow mx-auto max-w-2xl py-8 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id}  className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  <button onClick={handleFriendRequest} className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Request</button>
                </div>


                {isButtonVisible && 
  <a  href="/chat"><button className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Chat</button></a>
}

                
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
              </a>
            ))}
          </div>
        </div>
        </div>
        </div>
      </>
    )
  }
  