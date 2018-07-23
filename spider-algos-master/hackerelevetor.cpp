#include<bits/stdc++.h>
using namespace std;
struct floo
{
	int position;
	int net;
};
// binarysearch for insertion position of element
int search(floo arr[], int l, int r, int t)
{
	int m = (l + r) / 2;	
	if(l != m)
	{
		if(arr[m].position > t )
		{
			search(arr, l, m, t);
		}
		else if(arr[m].position < t )
		{
			search(arr, m + 1, r, t);
		}
		else if(arr[m].position == t)
		{
			return m;
		}
    }  
	else return l;
}
//  comparator function to sort objects
bool compare(floo a,floo b)
{
	return (a.position<b.position);
}

int main()
{
	int n, i, j, temp, t, capacity, in, out, people = 0, top, bottom;	
	floo arr[1000];
	
//	input no of floor and starting floor and capacity of lift 
	cin>>n>>t>>capacity;

//  inputting no of people in and out per floor
    for(i = 0; i < n; ++i)
	{
		cin>>arr[i].position;
		cin>>in;
		cin>>out;
		arr[i].net=in - out;		
	}

  	sort(arr, arr + n, compare);
  	
//	searching the position of element   
  	temp = search(arr, 0, n - 1, t);
  	for(i = temp + 1; i < n; ++i)
  	{
 
  		if((people+arr[i].net) <= capacity)
  		{
  			people += arr[i].net;
  			
		}
		else
		{
			break;
		}
  		
	  
	}
	top = i;
	
  	for(i=temp-1;i>=0;--i)
  	{
  		if((people + arr[i].net) <= capacity)
  		{
  			people += arr[i].net;
  			
		}
		else
		{
		
			break;
		}
  		
	}
	bottom = i;
  	
  	
//  outputting the required answer
  	cout<<t<<" ";
	for(i = temp + 1; i < top; ++i)
		{
			cout<<arr[i].position<<" ";		
		}
	for(i=temp;i>bottom;i--)
		{
	 		cout<<arr[i].position<<" ";
		}
	 
	 int d = 2 * (arr[top - 1].position - t) + (t - arr[bottom+1].position);
	 cout<<endl<<"Total Distance: "<<d;
}
