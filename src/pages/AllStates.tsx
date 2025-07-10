
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const INDIAN_STATES = [
  { name: 'Andhra Pradesh', capital: 'Amaravati', slug: 'andhra-pradesh' },
  { name: 'Arunachal Pradesh', capital: 'Itanagar', slug: 'arunachal-pradesh' },
  { name: 'Assam', capital: 'Dispur', slug: 'assam' },
  { name: 'Bihar', capital: 'Patna', slug: 'bihar' },
  { name: 'Chhattisgarh', capital: 'Raipur', slug: 'chhattisgarh' },
  { name: 'Goa', capital: 'Panaji', slug: 'goa' },
  { name: 'Gujarat', capital: 'Gandhinagar', slug: 'gujarat' },
  { name: 'Haryana', capital: 'Chandigarh', slug: 'haryana' },
  { name: 'Himachal Pradesh', capital: 'Shimla', slug: 'himachal-pradesh' },
  { name: 'Jharkhand', capital: 'Ranchi', slug: 'jharkhand' },
  { name: 'Karnataka', capital: 'Bengaluru', slug: 'karnataka' },
  { name: 'Kerala', capital: 'Thiruvananthapuram', slug: 'kerala' },
  { name: 'Madhya Pradesh', capital: 'Bhopal', slug: 'madhya-pradesh' },
  { name: 'Maharashtra', capital: 'Mumbai', slug: 'maharashtra' },
  { name: 'Manipur', capital: 'Imphal', slug: 'manipur' },
  { name: 'Meghalaya', capital: 'Shillong', slug: 'meghalaya' },
  { name: 'Mizoram', capital: 'Aizawl', slug: 'mizoram' },
  { name: 'Nagaland', capital: 'Kohima', slug: 'nagaland' },
  { name: 'Odisha', capital: 'Bhubaneswar', slug: 'odisha' },
  { name: 'Punjab', capital: 'Chandigarh', slug: 'punjab' },
  { name: 'Rajasthan', capital: 'Jaipur', slug: 'rajasthan' },
  { name: 'Sikkim', capital: 'Gangtok', slug: 'sikkim' },
  { name: 'Tamil Nadu', capital: 'Chennai', slug: 'tamil-nadu' },
  { name: 'Telangana', capital: 'Hyderabad', slug: 'telangana' },
  { name: 'Tripura', capital: 'Agartala', slug: 'tripura' },
  { name: 'Uttar Pradesh', capital: 'Lucknow', slug: 'uttar-pradesh' },
  { name: 'Uttarakhand', capital: 'Dehradun', slug: 'uttarakhand' },
  { name: 'West Bengal', capital: 'Kolkata', slug: 'west-bengal' },
  // Union Territories
  { name: 'Andaman and Nicobar Islands', capital: 'Port Blair', slug: 'andaman-nicobar' },
  { name: 'Chandigarh', capital: 'Chandigarh', slug: 'chandigarh' },
  { name: 'Dadra and Nagar Haveli', capital: 'Silvassa', slug: 'dadra-nagar-haveli' },
  { name: 'Daman and Diu', capital: 'Daman', slug: 'daman-diu' },
  { name: 'Delhi', capital: 'New Delhi', slug: 'delhi' },
  { name: 'Jammu and Kashmir', capital: 'Srinagar/Jammu', slug: 'jammu-kashmir' },
  { name: 'Ladakh', capital: 'Leh', slug: 'ladakh' },
  { name: 'Lakshadweep', capital: 'Kavaratti', slug: 'lakshadweep' },
  { name: 'Puducherry', capital: 'Puducherry', slug: 'puducherry' }
];

const AllStates = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🇮🇳 All States & Union Territories
        </h1>
        <p className="text-lg text-muted-foreground">
          Get the latest news from every state and union territory of India
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {INDIAN_STATES.map((state) => (
          <Link
            key={state.slug}
            to={`/news/${state.slug}`}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {state.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Capital: {state.capital}
                </p>
                <div className="text-xs text-primary font-medium">
                  Click to view news →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-muted/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">How it works</h3>
            <p className="text-muted-foreground">
              Click on any state or union territory to get the latest news from that region. 
              We use location-based keywords to fetch relevant news articles for each area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllStates;
